

# Create your tests here.
from users.models import User, Expert, Review

# Fetch users
users = User.objects.all()
print(users)

# Fetch experts
experts = Expert.objects.all()
print(experts)

# Fetch reviews
reviews = Review.objects.all()
print(reviews)
