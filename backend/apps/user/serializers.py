import re
from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ["username", "email", "password", "confirm_password"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_username(self, value):
        cleaned_username = " ".join(value.split())  # Remove extra spaces
        if len(cleaned_username.replace(" ", "")) < 3:
            raise serializers.ValidationError("Username must have at least 3 non-space characters.")
        return cleaned_username

    def validate_email(self, value):
        email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def validate_password(self, value):
        password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$"
        if not re.match(password_regex, value):
            raise serializers.ValidationError(
                "Password must be 8-32 characters long and contain at least one uppercase letter, "
                "one lowercase letter, one digit, and one special character."
            )
        return value

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")  # Remove confirm_password before saving
        user = UserProfile.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid login credentials")
        return user