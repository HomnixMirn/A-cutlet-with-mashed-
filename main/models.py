from django.db import models
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

# Create your models here.


class organization(models.Model):
    region = models.CharField(max_length=150)
    fio = models.CharField(max_length=250)
    email = models.CharField(max_length=250)
    
    def __str__(self):
        return self.region
    
class code(models.Model):
    code = models.CharField(max_length=250)
    email = models.CharField(max_length=250)
    
    def __str__(self):
        return self.code
    
class lastIvent(models.Model):
    city = models.CharField(max_length=250, blank=True, null=True)
    mens = models.CharField(max_length=250,blank=True, null=True)
    discipline = models.CharField(max_length=250,blank=True, null=True)
    title = models.CharField(max_length=250,blank=True, null=True)
    format = models.CharField(max_length=250,blank=True, null=True)
    date_start = models.CharField(max_length=250,blank=True, null=True)
    date_end = models.CharField(max_length=250,blank=True, null=True)
    
    def __str__(self):
        return self.title
    

class authorizedToken(Token):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def token(self):
        return self.key
    
    
class persona (models.Model):
    sexs=[('М','Мужчина'),('Ж','Женщина')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=250 , blank=True, null=True)
    id_user = models.CharField(max_length=250 , blank=True, null=True)
    fio = models.CharField(max_length=250   , blank=True, null=True)
    phone = models.IntegerField( blank=True, null=True)
    born_date = models.DateField( blank=True, null=True)
    sex = models.CharField(max_length=250 , choices=sexs , blank=True, null=True)
    country = models.CharField(max_length=250 , blank=True, null=True)
    region = models.CharField(max_length=250 , blank=True, null=True)
    city = models.CharField(max_length=250 , blank=True, null=True)
    
    def __str__(self):
        return self.fio    
    