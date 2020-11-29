from django.urls import path


from .views import *

app_name = 'todo'

urlpatterns = [
    path('task_detail/<str:pk>/', taskDetail, name='task_detail'),
    path('task_delete/<str:pk>/', taskDelete, name='task_delete'),
    path('task_update/<str:pk>/', taskUpdate, name='task_update'),
    path('task_create/', taskCreate, name='task_create'),
    path('task_list/', taskList, name='task_list'),
]
