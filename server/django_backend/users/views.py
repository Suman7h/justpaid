from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Expert, Review,Message  # Import Expert model
from .serializers import LoginSerializer,RegisterSerializer
from django.db.models import Avg, Max
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from django.db import IntegrityError


def get_tokens_for_user(user, role):

    refresh = RefreshToken()
    
    if role == "expert":
        refresh["userId"] = user.expertId  
        refresh["username"] = user.expertName
    else:
        refresh["userId"] = user.userId  
        refresh["username"] = user.username

    refresh["email"] = user.email
    refresh["role"] = role

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

class LoginAPIView(APIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role")

        if not email or not password or not role:
            return Response({"error": "Email, password, and role are required."}, status=status.HTTP_400_BAD_REQUEST)

        if role == "expert":
            
            try:
                expert = Expert.objects.get(email=email)
                if expert.password != password:  
                    return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

               
                tokens = get_tokens_for_user(expert, role="expert")
                return Response({
                    "refresh": tokens["refresh"],
                    "access": tokens["access"],
                    "user": {
                        "username": expert.expertName,
                        "email": expert.email,
                        "expertId":expert.expertId,
                        "role": "expert",
                        
                    },
                }, status=status.HTTP_200_OK)
            except Expert.DoesNotExist:
                return Response({"error": "Expert not found."}, status=status.HTTP_404_NOT_FOUND)

        else:
            
            user = authenticate(request, email=email, password=password)
            if user is None:
                return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

           
            tokens = get_tokens_for_user(user, role="user")
            return Response({
                "refresh": tokens["refresh"],
                "access": tokens["access"],
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "userId":user.userId,
                    "role": "user",
                },
            }, status=status.HTTP_200_OK)


class RegisterAPIView(APIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                role = serializer.validated_data.get("role", "user").lower()
                email = serializer.validated_data["email"]
                password = serializer.validated_data["password"]
                username = serializer.validated_data["username"]


                if role == "expert":
                    
                    expert = Expert.objects.create(
                        email=email,
                        expertName=username,
                        password=password,
                    )
                    tokens = get_tokens_for_user(expert, role="expert")
                    return Response(
                        {
                            "refresh": tokens["refresh"],
                            "access": tokens["access"],
                            "user": {
                                "expertid": expert.expertId,
                                "username": expert.expertName,
                                "email": expert.email,
                            },
                        },
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    
                    user = User.objects.create(
                        email=email,
                        username=username,
                        password=password,
                        role=role,
                    )
                    tokens = get_tokens_for_user(user, role="user")
                    return Response(
                        {
                            "refresh": tokens["refresh"],
                            "access": tokens["access"],
                            "user": {
                                "username": user.username,
                                "email": user.email,
                            },
                        },
                        status=status.HTTP_201_CREATED,
                    )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
        print("Validation Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterExpertAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            
            expert_id = request.data.get("expertId")
            company_name = request.data.get("companyName")
            introduction = request.data.get("introduction")
            estimated_price = request.data.get("estimatedPrice")
            years_in_service = request.data.get("yearsInService")
            num_of_employees = request.data.get("numOfEmployees")
            business_hours = request.data.get("businessHours")
            payment_methods = request.data.get("paymentMethods", [])
            categories = request.data.get("categories", [])
            location=request.data.get("location")

            
            if isinstance(payment_methods, list):
                payment_methods = list(map(str, payment_methods))  
            else:
                payment_methods = []

            if isinstance(categories, list):
                categories = list(map(str, categories))  
            else:
                categories = []

            
            expert = Expert.objects.get(expertId=expert_id)
            expert.companyName = company_name
            expert.introduction = introduction
            expert.estimatedPrice = estimated_price
            expert.yearsInService = years_in_service
            expert.numOfEmployees = num_of_employees
            expert.businessHours = business_hours
            expert.paymentMethods = payment_methods  
            expert.categories = categories 
            expert.location=location
            expert.save()

            return Response(
                {"message": "Expert registration completed successfully."},
                status=status.HTTP_200_OK,
            )
        except Expert.DoesNotExist:
            return Response(
                {"error": "Expert not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )



class ExpertSearchAPIView(APIView):
    def get(self, request, *args, **kwargs):
        search_query = request.query_params.get("searchQuery", "").strip().lower()
        location_query = request.query_params.get("locationQuery", "").lower()
        try:
            print("entered try block")
            
            experts = Expert.objects.filter(
                categories__overlap=[search_query],  
                location__icontains=location_query  
            )

            if not experts.exists():
                return Response([], status=status.HTTP_200_OK)

            
            result = []
            for expert in experts:
               
                avg_rating = (
                    Review.objects.filter(expertId=expert.expertId)
                    .aggregate(avg=Avg("numOfStars"))["avg"]
                )

                top_review = (
                    Review.objects.filter(expertId=expert.expertId)
                    .order_by("-numOfStars", "-dateOfReview")
                    .first()
                )
                review_count = Review.objects.filter(expertId=expert.expertId).count()
               
                result.append({
                    "expertId": expert.expertId,
                    "name": expert.expertName,
                    "price": expert.estimatedPrice,
                    "rating": round(avg_rating or 0, 1),
                    "reviewCount":review_count,
                    "reviewHighlight": top_review.review if top_review else "No reviews yet",
                })

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExpertValueAPIView(APIView):
    def get(self, request, *args, **kwargs):
        expert_id = request.query_params.get("id", "")
        print("Expert ID:", expert_id)

        try:
            
            expert = Expert.objects.filter(expertId=expert_id).first()

            if not expert:
                return Response({"error": "Expert not found."}, status=status.HTTP_404_NOT_FOUND)

            
            reviews = Review.objects.filter(expertId=expert.expertId)

            
            avg_rating = reviews.aggregate(avg=Avg("numOfStars"))["avg"]
            review_count = Review.objects.filter(expertId=expert.expertId).count()

            
            reviews_data = []
            for review in reviews:
             
                user = User.objects.filter(userId=review.userId).first()
                user_name = user.username if user else "Unknown User"

           
                reviews_data.append({
                    "reviewId": review.reviewId,
                    "numOfStars": review.numOfStars,
                    "review": review.review,
                    "userId": review.userId,  
                    "userName": user_name, 
                    "dateOfReview": review.dateOfReview,
                })

           
            expert_data = {
                "expertId": expert.expertId,
                "expertName": expert.expertName,
                "companyName": expert.companyName,
                "introduction": expert.introduction,
                "estimatedPrice": expert.estimatedPrice,
                "yearsInService": expert.yearsInService,
                "numOfEmployees": expert.numOfEmployees,
                "businessHours": expert.businessHours,  
                "paymentMethods": expert.paymentMethods,  
                "categories": expert.categories,  
                "location": expert.location,
                "averageRating": round(avg_rating or 0, 1),  
                "reviewCount":review_count,
                "reviews": reviews_data,  
            }

            
            return Response(expert_data, status=status.HTTP_200_OK)

        except Exception as e:
            
            print("Error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class ReviewValueAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Extract data from the request
        try:
            expert_id = request.data.get("expertId")
            user_id = request.data.get("userId")
            num_of_stars = request.data.get("numOfStars")
            review_content = request.data.get("review")

            # Validate required fields
            if not (expert_id and user_id and num_of_stars and review_content):
                return Response(
                    {"error": "All fields (expertId, userId, numOfStars, review) are required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Ensure the expert and user exist
            try:
                expert = Expert.objects.get(expertId=expert_id)
            except ObjectDoesNotExist:
                return Response(
                    {"error": "Expert not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            try:
                user = User.objects.get(userId=user_id)
            except ObjectDoesNotExist:
                return Response(
                    {"error": "User not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Create the review
            new_review = Review.objects.create(
                expertId=expert_id,
                userId=user_id,
                dateOfReview=timezone.now(),
                numOfStars=num_of_stars,
                review=review_content,
            )

            # Return a success response
            return Response(
                {
                    "message": "Review submitted successfully.",
                    "review": {
                        "reviewId": new_review.reviewId,
                        "expertId": expert_id,
                        "userId": user_id,
                        "numOfStars": num_of_stars,
                        "review": review_content,
                        "dateOfReview": new_review.dateOfReview,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            # Handle unexpected errors
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class MessageAPIView(APIView):
    def post(self, request):
        # Existing POST logic to create a new message
        expert_id = request.data.get("expertId")
        user_id = request.data.get("userId")
        message_content = request.data.get("message")
        role = request.data.get("role")
        
        try:
            # Validate required fields
            if not expert_id or not user_id or not role or not message_content:
                return Response({"error": "ExpertId, userId, message, and role are required."}, 
                                status=status.HTTP_400_BAD_REQUEST)
            
            # Fetch the user and expert details
            try:
                user = User.objects.get(userId=user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            try:
                expert = Expert.objects.get(expertId=expert_id)
            except Expert.DoesNotExist:
                return Response({"error": "Expert not found."}, status=status.HTTP_404_NOT_FOUND)

            # Create a new message record
            new_message = Message.objects.create(
                expertId=expert_id,
                userId=user_id,
                userName=user.username,        
                expertName=expert.expertName,  
                message=message_content,
                role=role
            )
            
            # Return a success response
            return Response({
                "message": "Message created successfully.",
                "data": {
                    "messageId": new_message.messageId,
                    "expertId": new_message.expertId,
                    "expertName": new_message.expertName,
                    "userId": new_message.userId,
                    "userName": new_message.userName,
                    "message": new_message.message,
                    "role": new_message.role,
                }
            }, status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            return Response({"error": "Database integrity error: " + str(e)}, 
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        # Fetch query parameters
        role = request.query_params.get("role")
        id = request.query_params.get("id")

        if not role or not id:
            return Response({"error": "Both 'role' and 'id' are required."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch messages based on the role
            if role == "user":
                messages = Message.objects.filter(userId=id).order_by("messageId")
            elif role == "expert":
                messages = Message.objects.filter(expertId=id).order_by("messageId")
            else:
                return Response({"error": "Invalid role. Accepted values are 'user' or 'expert'."}, 
                                status=status.HTTP_400_BAD_REQUEST)

            # Serialize the messages
            serialized_messages = [
                {
                    "messageId": msg.messageId,
                    "expertId": msg.expertId,
                    "expertName": msg.expertName,
                    "userId": msg.userId,
                    "userName": msg.userName,
                    "message": msg.message,
                    "role": msg.role,
                }
                for msg in messages
            ]

            return Response(serialized_messages, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)