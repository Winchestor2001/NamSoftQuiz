from django.urls import path
from . import views


urlpatterns = [
    path('', views.HomePage.as_view(), name='home'),
    # path('quiz/<str:token>', views.QuizPage.as_view(), name='quiz'),
    path('quiz/', views.QuizPage.as_view(), name='quiz'),

    path('quiz_api/', views.quiz_api, name='quiz_api'),
    path('post_student_score/', views.post_student_score),
]
