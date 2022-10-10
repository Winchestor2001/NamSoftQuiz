from email.policy import default
from random import choices
from tabnanny import verbose
from django.db import models
import uuid 

class Topic(models.Model):
    topic_name = models.CharField(max_length=255)
    topic_over_ball_procent = models.IntegerField(default=50, verbose_name='O\'tish ball foyizi', help_text='foyizda kiriting')
    topic_id = models.CharField(max_length=255, unique=True)

    def __str__(self) -> str:
        return self.topic_name


class Quiz(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.CharField(max_length=255)
    option_1 = models.CharField(max_length=255)
    option_2 = models.CharField(max_length=255)
    option_3 = models.CharField(max_length=255)
    option_4 = models.CharField(max_length=255)
    timer = models.IntegerField(default=15)

    def __str__(self) -> str:
        return self.question


class Student(models.Model):
    name = models.CharField(max_length=255)
    score = models.IntegerField(default=0)
    procent = models.CharField(max_length=255, blank=True, null=True)
    ip_address = models.GenericIPAddressField("IP")
    passed = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return '{} - {}'.format(self.name, self.score)
