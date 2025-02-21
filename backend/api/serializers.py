from rest_framework import serializers
from .models import Product_table, Worker, Booking, Admin

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_table
        fields = '__all__'

class WorkerSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Worker
        fields = ['id', 'name', 'skill', 'experience', 'phone', 'email', 'image', 
                 'rating', 'total_ratings', 'bio', 'availability', 'hourly_rate', 'created_at']
        
    def create(self, validated_data):
        # Set default values for optional fields
        validated_data['rating'] = validated_data.get('rating', 5.00)
        validated_data['total_ratings'] = validated_data.get('total_ratings', 0)
        validated_data['availability'] = validated_data.get('availability', True)
        validated_data['bio'] = validated_data.get('bio', '')
        
        return super().create(validated_data)

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['id', 'username', 'email']
