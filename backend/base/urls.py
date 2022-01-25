from django.urls import path, include
from . import views


users_urls = [
    path('login/', views.MyCreatorTokenView.as_view(), name='token-obtain-pair'),
    path('profile/', views.getUserProfile, name='users-profile'),
    path('', views.getUsers, name='users'),
    path('register/', views.registerUser,name='register')
]


urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('products/', views.getProducts, name='products'),
    path('products/<str:pk>/', views.getProduct, name='product'),
    path('users/', include(users_urls))
]
