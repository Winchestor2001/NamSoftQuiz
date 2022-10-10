from pydoc_data import topics
from django.shortcuts import render, redirect, HttpResponse
from django.views import View
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import QuizSerializer, StudentSerializer
from .models import *
import random


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip



class HomePage(View):
    def get(self, request):
        return render(request, 'page_not_found.html')


class QuizPage(View):
    def get(self, request):
        ip = get_client_ip(request)
        topic = Topic.objects.get(topic_name='Python')
        student = Student.objects.filter(ip_address=ip)
        # if topic.topic_id == token and len(student) == 0:
        if len(student) == 0:
            return render(request, 'quiz.html')
        return redirect('home')


@api_view(['GET'])
def quiz_api(request):
    quizes = Quiz.objects.all()
    serializer = QuizSerializer(quizes, many=True)
    data = serializer.data
    random.shuffle(data)
    return Response(data)


@api_view(['POST'])
def post_student_score(request):
    questions = Quiz.objects.filter(topic__topic_name='Python').count()
    topic_passed_procent = Topic.objects.get(topic_name='Python').topic_over_ball_procent
    student = Student.objects.filter(name=request.data.get('name'), ip_address=request.data.get('ip'))
    user_procent = round(int(request.data.get('score')) * 100 / questions, 2)
    if len(student) == 0:
        passed = False
        if topic_passed_procent <= user_procent:
            passed = True
        student = Student.objects.create(name=request.data.get('name'), ip_address=request.data.get('ip'), score=request.data.get('score'), procent=f"{user_procent}%", passed=passed)
        # serializer = StudentSerializer(data=request.data)
        # serializer.is_valid()
        # serializer.save()
        student.save()
        return HttpResponse('true')
    else:
        return HttpResponse('false')


def error_404_view(request, exception):
    return render(request, 'page_not_found.html')
