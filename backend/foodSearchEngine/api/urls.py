from django.urls import path
from django.conf.urls import include, url

from . import  views
urlpatterns = [
    path('generalSearchInput/', views.SearchEngine.foodSearch),
    path('foodDetails/', views.SearchEngine.foodDetails),
]
