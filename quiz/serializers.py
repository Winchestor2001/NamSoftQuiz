from rest_framework import serializers
from .models import *


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'


class StudentSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return Student.objects.create(**validated_data)
        
    class Meta:
        model = Student
        fields = ['name', 'score', 'ip_address']
        
