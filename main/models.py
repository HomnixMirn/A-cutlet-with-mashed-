from django.db import models

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
    pass