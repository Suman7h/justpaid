from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField

class User(models.Model):
    userId = models.AutoField(primary_key=True, db_column='userId')
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, default='user')

    class Meta:
        db_table = '"User"' 
        managed = False 

class Expert(models.Model):
    expertId = models.AutoField(primary_key=True,db_column='expertId')
    expertName = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    companyName = models.TextField(null=True, blank=True)
    introduction = models.TextField(null=True, blank=True)
    estimatedPrice = models.FloatField(null=True, blank=True)
    yearsInService = models.IntegerField(null=True, blank=True)
    numOfEmployees = models.IntegerField(null=True, blank=True)
    businessHours = models.JSONField(null=True, blank=True)
    paymentMethods = ArrayField(models.TextField(), default=list)
    background = models.TextField(null=True, blank=True)
    similarJobsNearYou = models.IntegerField()
    categories = ArrayField(models.TextField(), default=list) 
    location= models.TextField(null=True, blank=True)
    
    class Meta:
        db_table = '"Expert"'
        managed = False  
class Review(models.Model):
    reviewId = models.AutoField(primary_key=True, db_column='reviewId')
    expertId = models.IntegerField(db_column='expertId')  
    numOfStars = models.IntegerField(default=5)
    review = models.TextField()
    userId = models.IntegerField(db_column='userId')  
    dateOfReview = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = '"Review"'
        managed = False

class Message(models.Model):
    messageId = models.AutoField(primary_key=True, db_column='messageId')
    expertId = models.IntegerField(db_column='expertId')
    userId = models.IntegerField(db_column='userId')
    message = models.TextField()
    role=models.TextField()
    userName=models.CharField(max_length=255)
    expertName = models.CharField(max_length=255)
    class Meta:
        db_table = '"message"'
        managed = False