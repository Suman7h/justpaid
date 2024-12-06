"""
URL configuration for django_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from users.views import  LoginAPIView,RegisterAPIView,RegisterExpertAPIView,ExpertSearchAPIView,ExpertValueAPIView,ReviewValueAPIView,MessageAPIView

urlpatterns = [

    path('login/', LoginAPIView.as_view(), name='login'),
    path('register/',RegisterAPIView.as_view(),name='register'),
    path('register/expert',RegisterExpertAPIView.as_view(),name='register/expert'),
    path('search/', ExpertSearchAPIView.as_view(),name='search'),
    path('details/',ExpertValueAPIView.as_view(),name='details'),
    path('review/',ReviewValueAPIView.as_view(),name='review'),
    path('message/',MessageAPIView.as_view(),name='message')
]

