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
from .parser import getLastIvents
import datetime
from django.contrib.auth.models import User

# Create your views here.


# data = getInfo.get_ruks()
# organization.objects.all().delete()
# for i in data:
#     organization.objects.create(region=i[0],fio=i[1],email=i[2])

# data = getLastIvents.get_last_events()
# lastIvent.objects.all().delete()
# for i in data:
#     print(22)
#     lastIvent.objects.create(city=i['city'],mens=i['mens'],discipline=i['discipline'],title=i['title'],format=i['format'], date_start = i['dates'][0] ,date_end= i['dates'][1]if len(i['dates']) > 1 else None)
    





@api_view(['POST'])
def register(request : HttpRequest):
    if request.method == 'POST':
        data = json.loads(request.body)
        if 'email' in data:
            email = data['email']
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            if 'email_code' in data:
                if code.objects.get(code = data['code']):
                    try:
                        password = data['password']
                        persona.objects.create(user = User.objects.create_user(username=email, password= password))
                        
                        code.objects.get(code = data['code']).delete()
                        return Response( status=status.HTTP_201_CREATED)
                    except Exception as _ex:
                        return Response({'error': f'{_ex}'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'error': 'Неверный код'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Неверный код'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Email not found'}, status=status.HTTP_400_BAD_REQUEST)
        
    
    
    
@api_view(['POST'])
def get_code(request : HttpRequest):
    if request.method == 'POST':
        
        data = json.loads(request.body)
        print(data)
        if 'email' in data:
            email = data['email']
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                if code.objects.filter(email = email).exists():
                    code.objects.filter(email = email).delete()
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
    
                
@api_view(['GET'])
def personalInfo(request: HttpRequest):
    if request.method =="GET":
        if request.headers.get('Authorization'):
            try:
                
                token = request.headers.get('Authorization').split(' ')[1]
                if authorizedToken.objects.filter(key=token).exists():
                    users = authorizedToken.objects.get(key=token).user

                    return Response({'user': personalSerializer(persona.objects.get(user =users)).data}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Authorization header is missing'}, status=status.HTTP_401_UNAUTHORIZED)
        
        
@api_view(["POST"])
def login(request : HttpRequest):
    if request.method == "POST":
        data = json.loads(request.body)
        if 'email' in data and 'password' in data :
            try:
                user = authenticate(username = data['email'], password = data['password'] )
                token = authorizedToken.objects.get_or_create(user = user)[0].key
                return Response({'token': token}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            

@api_view(['GET'])
def logout(request : HttpRequest):
    if request.method =="GET":
        if request.headers.get('Authorization'):
            try:
                token = request.headers.get('Authorization').split(' ')[1]
                if authorizedToken.objects.filter(key=token).exists():
                    user = authorizedToken.objects.get(key=token).delete()
                    return Response( status=status.HTTP_200_OK)
                
            except Exception as e:
                
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': "Authorization header is missing"}, status=status.HTTP_401_UNAUTHORIZED)
        
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    
@api_view(["POST"])
def redactPersonal(request:HttpRequest):
    if request.method == "POST":
        data = json.loads(request.body)
        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization').split(' ')[1]
            try:
                name = data['name']
                id_user = data['id_user']
                fio = data['fio']
                phone= data['phone']
                born_date = data['born_date']
                sex = data['sex']
                country = data['county']
                region = data['region']
                city = data['city']
                user = authorizedToken.objects.get(key=token).user
                personal = persona.objects.get(user = user)
                personal(name = name , id_user = id_user, fio = fio, phone = phone, born_date = born_date , sex =sex, country = country , region = region, city = city)
                
                personal.save_base()
                return Response(status=status.HTTP_202_ACCEPTED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        else:
            return Response({'error': "Authorization header is missing"}, status=status.HTTP_401_UNAUTHORIZED)
                
            
    
