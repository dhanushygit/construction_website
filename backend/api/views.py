from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime
from django.db.models import Count

from .models import Product_table, Worker, Booking, Admin
from .serializers import ProductSerializer, WorkerSerializer, BookingSerializer, AdminSerializer
from .forms import ProductForm

# Create your views here.

class ProductListView(APIView):
    def get(self, request):
        products = Product_table.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


def create_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return render(request, 'api/create_product.html', {'msg':'user inserted sucessfully'} )# Replace with the name of the URL for your product list page
    else:
        form = ProductForm()
    return render(request, 'api/create_product.html', {'form': form})




class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Check if the user exists and the password matches
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Optional: Return user details or a token for further authentication
            return Response({
                "message": "Login successful",
                "username": user.username
            }, status=status.HTTP_200_OK)
        
        # If authentication fails
        return Response({
            "message": "Invalid username or password"
        }, status=status.HTTP_401_UNAUTHORIZED)



class SignupView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if the username already exists
        if User.objects.filter(username=username).exists():
            return Response({"message": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new user
        user = User.objects.create_user(username=username, email=email, password=password)

        # Prepare email content
        subject = 'Welcome to HCS Services'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [email]

        # Plain text content
        text_content = f"""
        Dear {username},

        Thank you for signing up with HCS Services. We are thrilled to have you on board.

        Our platform offers a wide range of construction and household services tailored to meet your needs. Feel free to explore and make the most of our offerings.

        If you have any questions or need assistance, please do not hesitate to contact our support team.

        Best regards,
        The HCS Services Team
        """

        # HTML content
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to HCS Services</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background-color: #3b82f6;
                    color: #ffffff;
                    padding: 10px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }}
                .content {{
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    font-size: 12px;
                    color: #777;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to HCS Services, {username}!</h1>
                </div>
                <div class="content">
                    <p>Dear {username},</p>
                    <p>Thank you for signing up with HCS Services. We are thrilled to have you on board.</p>
                    <p>Our platform offers a wide range of construction and household services tailored to meet your needs. Feel free to explore and make the most of our offerings.</p>
                    <p>If you have any questions or need assistance, please do not hesitate to contact our support team.</p>
                    <p>Best regards,<br>The HCS Services Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 HCS Services. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        # Create the email message
        msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        msg.attach_alternative(html_content, "text/html")

        # Send the email
        msg.send()

        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)



class PasswordResetView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "No user found with this email."}, status=status.HTTP_404_NOT_FOUND)

        # Generate reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(str(user.pk).encode())

        # Send email with the reset link
        reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"
        email_subject = "Password Reset Request"
        email_message = f"Hi {user.username},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n{reset_url}\n\nIf you did not request this, please ignore this email.\n\nThank you!"
        send_mail(email_subject, email_message, settings.DEFAULT_FROM_EMAIL, [email])

        return Response({"detail": "Password reset link sent to your email."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    def post(self, request):
        token = request.data.get("token")
        password = request.data.get("password")
        uidb64 = request.data.get("uidb64")

        if not token or not password or not uidb64:
            return Response({"detail": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, User.DoesNotExist):
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        # Reset the password
        user.set_password(password)
        user.save()

        return Response({"detail": "Password has been successfully updated."}, status=status.HTTP_200_OK)


class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            admin = Admin.objects.get(username=username)
            if check_password(password, admin.password):
                return Response({
                    'status': 'success',
                    'message': 'Login successful',
                    'user': {
                        'username': admin.username,
                        'email': admin.email
                    }
                })
            else:
                return Response({
                    'status': 'error',
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except Admin.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Admin not found'
            }, status=status.HTTP_404_NOT_FOUND)

class WorkerListCreateView(generics.ListCreateAPIView):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    
    def get(self, request):
        workers = self.queryset.all()
        serializer = self.serializer_class(workers, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        try:
            print("Received data:", request.data)
            print("Received files:", request.FILES)
            
            serializer = self.serializer_class(data=request.data, context={'request': request})
            
            if serializer.is_valid():
                worker = serializer.save()
                
                # Handle image upload
                if 'image' in request.FILES:
                    worker.image = request.FILES['image']
                    worker.save()
                
                return Response({
                    'message': 'Worker created successfully',
                    'worker': self.serializer_class(worker, context={'request': request}).data
                }, status=status.HTTP_201_CREATED)
            else:
                print("Serializer errors:", serializer.errors)
                return Response({
                    'error': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error creating worker:", str(e))
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class WorkerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Worker.objects.all()
    
    def get(self, request, pk):
        try:
            worker = self.queryset.get(pk=pk)
            data = {
                'id': worker.id,
                'name': worker.name,
                'skill': worker.skill,
                'experience': worker.experience,
                'phone': worker.phone,
                'email': worker.email,
                'image': request.build_absolute_uri(worker.image.url) if worker.image else None,
                'bio': worker.bio,
                'hourly_rate': worker.hourly_rate,
                'availability': worker.availability,
                'rating': worker.rating,
                'total_ratings': worker.total_ratings,
                'created_at': worker.created_at
            }
            return Response(data)
        except Worker.DoesNotExist:
            return Response({
                'error': 'Worker not found'
            }, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            worker = self.queryset.get(pk=pk)
            worker.name = request.data.get('name', worker.name)
            worker.skill = request.data.get('skill', worker.skill)
            worker.experience = request.data.get('experience', worker.experience)
            worker.phone = request.data.get('phone', worker.phone)
            worker.email = request.data.get('email', worker.email)
            worker.bio = request.data.get('bio', worker.bio)
            worker.hourly_rate = request.data.get('hourly_rate', worker.hourly_rate)
            worker.availability = request.data.get('availability', worker.availability)
            if 'image' in request.FILES:
                worker.image = request.FILES['image']
            worker.save()
            return Response({
                'message': 'Worker updated successfully'
            })
        except Worker.DoesNotExist:
            return Response({
                'error': 'Worker not found'
            }, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            worker = self.queryset.get(pk=pk)
            worker.delete()
            return Response({
                'message': 'Worker deleted successfully'
            })
        except Worker.DoesNotExist:
            return Response({
                'error': 'Worker not found'
            }, status=status.HTTP_404_NOT_FOUND)

class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        booking = serializer.save()
        
        # Send email to worker
        worker = booking.worker
        if worker and worker.email:
            subject = 'New Booking Request'
            message = f'''
            You have a new booking request:
            
            Customer: {booking.customer_name}
            Service: {booking.service_type}
            Date: {booking.booking_date}
            Message: {booking.message}
            
            Please respond to this booking request through your dashboard.
            '''
            
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [worker.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending email to worker: {e}")
        
        # Send confirmation email to customer
        if booking.customer_email:
            subject = 'Booking Confirmation - HCS Services'
            message = f'''
            Dear {booking.customer_name},
            
            Thank you for booking with HCS Services. Your booking details:
            
            Service: {booking.service_type}
            Date: {booking.booking_date}
            Status: Pending Worker Response
            
            We will notify you once the worker responds to your booking request.
            '''
            
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [booking.customer_email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending email to customer: {e}")

class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if username == 'admin' and password == 'admin123':
        return Response({
            'status': 'success',
            'message': 'Login successful',
            'user': {
                'username': 'admin',
                'role': 'admin'
            }
        })
    
    return Response({
        'status': 'error',
        'message': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def worker_response(request, pk):
    booking = get_object_or_404(Booking, pk=pk)
    action = request.data.get('action')
    
    if action not in ['accept', 'reject']:
        return Response(
            {'error': 'Invalid action. Must be either "accept" or "reject".'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    booking.status = 'ACCEPTED' if action == 'accept' else 'REJECTED'
    booking.worker_response_time = timezone.now()
    booking.worker_notes = request.data.get('notes', '')
    booking.save()
    
    # Send email notification to customer
    subject = 'Booking Update'
    message = f'''
    Hello {booking.customer_name},
    
    Your booking for {booking.service_type} has been {"accepted" if action == "accept" else "rejected"} by {booking.worker.name}.
    
    {"Your service provider will contact you shortly." if action == "accept" else "Please try booking with another service provider."}
    
    Booking Details:
    Date: {booking.booking_date}
    Service: {booking.service_type}
    '''
    
    if booking.customer_email:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [booking.customer_email],
            fail_silently=False,
        )
    
    return Response({'status': 'success'})

@api_view(['GET'])
def worker_bookings(request, worker_id):
    bookings = Booking.objects.filter(worker_id=worker_id)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def send_booking_email(request):
    booking_id = request.data.get('booking_id')
    status = request.data.get('status')

    try:
        booking = Booking.objects.get(id=booking_id)
        worker = booking.worker
        user = booking.user

        # Prepare email content
        subject = 'Booking Confirmation - HCS Services'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [user.email]

        # HTML content
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">Booking Confirmation</h2>
                <p>Dear {user.username},</p>
                <p>Your booking has been confirmed!</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Booking Details:</h3>
                    <p><strong>Service:</strong> {worker.skill}</p>
                    <p><strong>Provider:</strong> {worker.name}</p>
                    <p><strong>Date:</strong> {booking.date}</p>
                    <p><strong>Time:</strong> {booking.time}</p>
                    <p><strong>Status:</strong> {status}</p>
                </div>
                
                <p>If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
                
                <p>Best regards,<br>HCS Services Team</p>
            </div>
        </body>
        </html>
        """

        # Plain text content
        text_content = f"""
        Booking Confirmation - HCS Services

        Dear {user.username},

        Your booking has been confirmed!

        Booking Details:
        Service: {worker.skill}
        Provider: {worker.name}
        Date: {booking.date}
        Time: {booking.time}
        Status: {status}

        If you have any questions or need to make changes to your booking, please don't hesitate to contact us.

        Best regards,
        HCS Services Team
        """

        # Create email message
        msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response({
            "message": "Booking confirmation email sent successfully"
        }, status=status.HTTP_200_OK)

    except Booking.DoesNotExist:
        return Response({
            "message": "Booking not found"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "message": f"Error sending email: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AvailableProvidersView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get(self, request):
        date = request.query_params.get('date')
        service = request.query_params.get('service')
        
        if not service:
            return Response(
                {'error': 'Service type is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get workers who provide the requested service
            workers = Worker.objects.filter(skill__iexact=service, availability=True)
            
            if date:
                try:
                    booking_date = datetime.strptime(date, '%Y-%m-%d').date()
                    
                    # Get bookings for the specified date
                    bookings = Booking.objects.filter(
                        booking_date=booking_date,
                        status__in=['PENDING', 'ACCEPTED']
                    )
                    
                    # Exclude workers who are already booked
                    booked_worker_ids = bookings.values_list('worker_id', flat=True)
                    workers = workers.exclude(id__in=booked_worker_ids)
                except ValueError:
                    return Response(
                        {'error': 'Invalid date format. Please use YYYY-MM-DD'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            serializer = WorkerSerializer(workers, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            print(f"Error in AvailableProvidersView: {str(e)}")  # Add logging
            return Response(
                {'error': 'Failed to fetch available providers'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
