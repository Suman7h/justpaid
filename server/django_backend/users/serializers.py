from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User , Expert, Review




class ExpertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expert
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


# Register Serializer
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=["user", "expert"], required=True)

    def validate_email(self, value):
        """
        Check if the email is already in use.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate(self, data):
        """
        Validate additional conditions if required.
        """
        if len(data["password"]) < 6:
            raise serializers.ValidationError(
                {"password": "Password must be at least 6 characters long."}
            )
        return data


# Login Serializer

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    role = serializers.CharField(required=True, write_only=True)
    print("Validation method called")
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if not email or not password or not role:
            raise serializers.ValidationError(
                "Email, password, and role are required."
            )

        user = None

        if role == "expert":
            print("it entered here")
            # Fetch the expert details
            try:
                expert = Expert.objects.get(email=email)
                # Verify password manually as authenticate() won't work directly for custom models
                if not expert.password == password:  # Assuming plaintext password (not recommended)
                    raise serializers.ValidationError("Invalid email or password for expert.")
                user = expert
            except Expert.DoesNotExist:
                raise serializers.ValidationError("Expert not found.")
        else:
            print("it entered into user")
            # Authenticate the regular user
            user = authenticate(email=email, password=password)
            if user is None:
                raise serializers.ValidationError("Invalid email or password for user.")

        data['user'] = user
        return data
