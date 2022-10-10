from django.contrib import admin
from .models import *


class TopicAdmin(admin.ModelAdmin):
    list_display = ['topic_name', 'topic_over_ball_procent', 'topic_id']


class QuizAdmin(admin.ModelAdmin):
    list_display = ['topic', 'question', 'timer']


class StudentAdmin(admin.ModelAdmin):
    list_display = ['name', 'score', 'procent', 'passed', 'ip_address', 'date']



admin.site.register(Topic, TopicAdmin)
admin.site.register(Quiz, QuizAdmin)
admin.site.register(Student, StudentAdmin)

