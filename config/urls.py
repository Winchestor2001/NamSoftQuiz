from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve
from django.conf import settings
from django.conf.urls import handler404, handler500
from quiz.views import error_404_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('quiz.urls')),
    path('error/', error_404_view, name='error_404'),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]

handler404 = "quiz.views.error_404_view"