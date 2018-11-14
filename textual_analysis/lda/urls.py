from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="lda-mainpage"),
    path('about/', views.about, name="lda-aboutpage")
]
