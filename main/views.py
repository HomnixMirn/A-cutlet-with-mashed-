from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import *
from django.http import HttpRequest
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.auth import authenticate 
import json
from .models import *
import re
from django.shortcuts import redirect
from geopy.geocoders import Nominatim
from .sendEmail import getEmailCode
from datetime import datetime
import random
from .parser import getInfo

# Create your views here.


# data = getInfo.get_ruks()
# organization.objects.all().delete()
# for i in data:
#     organization.objects.create(region=i[0],fio=i[1],email=i[2])
    



@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if 'email' in data:
            email = data['email']
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Email registered successfully'}, status=status.HTTP_201_CREATED)
    
@api_view(['POST'])
def get_code(request):
    if request.method == 'POST':
        
        data = json.loads(request.body)
        print(data)
        if 'email' in data:
            email = data['email']
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                cod = random.randint(100000, 999999)
                getEmailCode.sendVerificated(email,cod)    
                code.objects.create(code=cod,email=email)
                return Response( status=status.HTTP_201_CREATED)
            except Exception as _ex:
                return Response({'error': f'{_ex}'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Email registered successfully'}, status=status.HTTP_201_CREATED)
    
    
@api_view(['GET'])
def getOrganization(request):
    if request.method == 'GET':
        org = organization.objects.all()
        serializer = OrganizationSerializer(org,many=True)
        return Response(serializer.data)
    
                
            
            
            
