from django.contrib.auth.backends import BaseBackend
from .models import User

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None):
        try:
            user = User.objects.get(email__iexact=email)  
            
            if user.password == password:  
                return user
            else:
                print("Password mismatch.")
        except User.DoesNotExist:
            print("User does not exist.")
            return None

