from django.urls import path
from django.conf.urls import include, url

from . import  views
urlpatterns = [
    path('createUser/', views.UserClass.create_user),
    path('updateUserData/', views.UserClass.update_user),
    path('allUserData/', views.UserClass.get_all_user_info_by_token),
    path('userData/', views.UserClass.get_user_meals_by_user_token_view),
    path('updateMeal/', views.UserClass.update_meal),
    path('deleteMeal/', views.UserClass.delete_meal),
    path('addWater/', views.UserClass.add_water),
]
