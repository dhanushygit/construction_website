from django.urls import path
from .views import (
    ProductListView, create_product, LoginView, SignupView,
    admin_login, WorkerListCreateView, WorkerDetailView,
    BookingListCreateView, BookingDetailView, worker_response, worker_bookings,
    AvailableProvidersView
)
from . import views

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('create-product/', create_product, name='create_product'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # Admin endpoints
    path('admin/login/', admin_login, name='admin-login'),
    
    # Worker endpoints
    path('workers/', WorkerListCreateView.as_view(), name='worker-list-create'),
    path('workers/<int:pk>/', WorkerDetailView.as_view(), name='worker-detail'),
    path('workers/<int:worker_id>/bookings/', worker_bookings, name='worker-bookings'),
    
    # Booking endpoints
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<int:pk>/response/', worker_response, name='worker-response'),
    path('available-providers/', AvailableProvidersView.as_view(), name='available-providers'),
    path('send-booking-email/', views.send_booking_email, name='send-booking-email'),
]

# Serve media files during development
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
