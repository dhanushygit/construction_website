from django.urls import path
from . import views
urlpatterns=[
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('home/',views.home_view,name='home'),
    path('services/',views.services_view,name='services'),
    path('contact/',views.contact_view,name='contact'),
    path('about/',views.about_view,name='about'),
]