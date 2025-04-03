from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class AdminLoginSerializer(serializers.Serializer): 
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        print('serializers entered')
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            raise serializers.ValidationError({"detail": "Email and password are required."})

        user = authenticate(email=email, password=password)
        
        if not user:
            raise serializers.ValidationError({"detail": "Invalid credentials. Please try again."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "Your account has been blocked."})

        if not user.is_staff:
            raise serializers.ValidationError({"detail": "Unauthorized: Not an admin."})

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "is_staff": user.is_staff,
            },
        }
