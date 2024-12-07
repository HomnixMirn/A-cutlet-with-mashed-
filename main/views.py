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
from .sendEmail import sendRestorePassword
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
#     user = User.objects.create_user(username=i[2], password='admin')
#     organization.objects.create(region=i[0],fio=i[1],email=i[2],user =user)

# data = getLastIvents.get_last_events()
# lastIvent.objects.all().delete()
# for i in data:
#     print(22)
#     lastIvent.objects.create(city=i['city'],mens=i['mens'],discipline=i['discipline'],title=i['title'],format=i['format'], date_start = i['dates'][0] ,date_end= i['dates'][1]if len(i['dates']) > 1 else None)
    





@api_view(['POST'])
def register(request : HttpRequest):
    if request.method == 'POST':
        data = request.data
        print(data)
        if 'email' in data:
            email = data['email']
            
            print(code.objects.get(code = data['code']))
            if User.objects.filter(username=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            if 'code' in data:
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
        print(request.data)
        data = request.data
        if 'email' in data:
            email = data['email']
            if User.objects.filter(username=email).exists():
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
        else:
            return Response({'error': 'Email not found'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    
@api_view(['GET'])
def getOrganization(request):
    if request.method == 'GET':
        org = organization.objects.all()
        if 'search' in request.GET:
            search = request.GET['search']
            org = org.filter(Q(region__icontains=search.lower()) | Q(region__icontains=search.title()) | Q(region__icontains=search.upper()))
            
        
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
                    if organization.objects.filter(user = users).exists():
                        if not OrganizationsEvents.objects.filter(organization = organization.objects.get(user=users)).exists():
                                OrganizationsEvents.objects.create(organization = organization.objects.get(user=users))
                        return Response({'user': OrganizationsEventsSerializer(OrganizationsEvents.objects.get(organization = organization.objects.get(user=users))).data}, status=status.HTTP_200_OK)
                    if not personaEvents.objects.filter(persona = persona.objects.get(user=users)).exists():
                        personaEvents.objects.create(persona = persona.objects.get(user=users))
                    return Response({'user': PersonaEventsSerializer(personaEvents.objects.get(persona = persona.objects.get(user=users))).data}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Authorization header is missing'}, status=status.HTTP_401_UNAUTHORIZED)
        
        
@api_view(["POST"])
def login(request : HttpRequest):
    if request.method == "POST":
        data = request.data
        if 'email' in data and 'password' in data :
            try:
                user = authenticate(username = data['email'], password = data['password'] )
                token = authorizedToken.objects.get_or_create(user = user)[0].key
                return Response({'token': token}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
            

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
                if 'name' in data :
                    name = data['name']
                else:
                    name = ''
                if 'id_user' in data :
                    id_user = data['id_user']
                else:
                    id_user = ''
                if 'fio' in data :
                    fio = data['fio']
                else:
                    fio = ''
                if 'phone' in data :
                    phone = data['phone']
                else:
                    phone = ''
                if 'born_date' in data :
                    born_date = data['born_date']
                else:
                    born_date = ''
                if 'sex' in data :
                    sex = data['sex']
                else:
                    sex = ''
                if 'country' in data :
                    country = data['country']
                else:
                    country = ''
                if 'region' in data :
                    region = data['region']
                else:
                    region = ''
                if 'city' in data :
                    city = data['city']
                else:
                    city = ''
                user = authorizedToken.objects.get(key=token).user
                personal = persona.objects.get(user = user)
                print(personal)
                personal.name = name
                personal.id_user = id_user
                personal.fio = fio
                personal.phone = phone
                personal.born_date = born_date
                personal.sex = sex
                personal.country = country
                personal.region = region
                personal.city = city
                personal.save_base()
                
                return Response(status=status.HTTP_202_ACCEPTED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        else:
            return Response({'error': "Authorization header is missing"}, status=status.HTTP_401_UNAUTHORIZED)
                
            
    
@api_view(['GET'])
def getTekEvent(request: HttpRequest):
    if request.method == 'GET':
        try:
            event = Event.objects.filter(Q(date_start__gte = datetime.datetime.today()) &Q(verify = True)).order_by('date_start').first()
            
            serializer = EventSerializer(event)
            return Response(serializer.data , status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def createEvent(request: HttpRequest):
    if request.method == 'POST':
        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization').split(' ')[1]
            if not authorizedToken.objects.filter(key=token).exists():
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            if not organization.objects.filter(user = authorizedToken.objects.get(key=token).user).exists():
                return Response({'error': 'You are not an organization'}, status=status.HTTP_401_UNAUTHORIZED)
            organ = organization.objects.get(user = authorizedToken.objects.get(key=token).user)
            data = request.data
            if 'name' in data and 'date_start' in data and 'date_end' in data and 'type' in data and 'age_group' in data:
                try:
                    event = Event.objects.create(name = data['name'], date_start = data['date_start'], date_end = data['date_end'], type = data['type'], age_group = data['age_group'])
                    if OrganizationsEvents.objects.filter(organization = organ).exists():
                        OrganizationsEvents.objects.get(organization = organ).events.add(event)
                    else:
                        OrganizationsEvents.objects.create(organization = organ , events = event)
                    
                    return Response(status=status.HTTP_201_CREATED)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': "Authorization header is missing"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['POST'])
def verifyEvent(request: HttpRequest):
    if request.method == 'POST':
        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization').split(' ')[1]
            if not authorizedToken.objects.filter(key=token).exists():
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            if not organization.objects.filter(user = authorizedToken.objects.get(key=token).user).exists():
                return Response({'error': 'You are not an organization'}, status=status.HTTP_401_UNAUTHORIZED)
            organ = organization.objects.get(user = authorizedToken.objects.get(key=token).user)
            if organ.admin != True:
                return Response({'error': 'You are not an admin'}, status=status.HTTP_401_UNAUTHORIZED)
            data = request.data
            if 'id' in data:
                
                try:
                    event = Event.objects.get(id = data['id'])
                    if OrganizationsEvents.objects.filter(Q(organization = organ)&Q(events = event)).exists():
                        return Response({'error': 'you cannot verify your event'}, status=status.HTTP_400_BAD_REQUEST)
                    event.verify = True
                    event.save()
                    return Response(status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': "Authorization header is missing"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['GET'])
def getNotVerifiedEvents(request: HttpRequest):
    if request.method == 'GET':
        try:
            events = Event.objects.filter(verify = False)
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data , status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['POST'])
def deleteEvent(request: HttpRequest):
    if request.method == 'POST':
        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization').split(' ')[1]
            if not authorizedToken.objects.filter(key=token).exists():
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            if not organization.objects.filter(user = authorizedToken.objects.get(key=token).user).exists():
                return Response({'error': 'You are not an organization'}, status=status.HTTP_401_UNAUTHORIZED)
            organ = organization.objects.get(user = authorizedToken.objects.get(key=token).user)
            if organ.admin != True:
                return Response({'error': 'You are not an admin'}, status=status.HTTP_401_UNAUTHORIZED)
            data = request.data
            if 'id' in data:
                try:
                    event = Event.objects.get(id = data['id'])
                    event.delete()
                    return Response(status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': "Authorization header is missing"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

@api_view(['POST'])
def addEventToPersonal(request: HttpRequest):
    if request.method == 'POST':
        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization').split(' ')[1]
            if not authorizedToken.objects.filter(key=token).exists():
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            if not persona.objects.filter(user = authorizedToken.objects.get(key=token).user).exists():
                return Response({'error': 'You are not a persona'}, status=status.HTTP_401_UNAUTHORIZED)
            perso = persona.objects.get(user = authorizedToken.objects.get(key=token).user)
            data = request.data
            if 'id' in data:
                try:
                    event = Event.objects.get(id = data['id'])
                    if personaEvents.objects.filter(Q(persona = perso)&Q(events = event)).exists():
                        return Response({'error': 'You already have this event'}, status=status.HTTP_400_BAD_REQUEST)
                    if personaEvents.objects.filter(persona = perso).exists():
                        personaEvents.objects.get(persona = perso).events.add(event)
                    else:
                        personaEvents.objects.create(persona = perso , events = event)
                    return Response(status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': "Authorization header is missing"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
                           
@api_view(['GET'])
def getOrganizationsInfo(request: HttpRequest, id: int):
    if request.method == 'GET':
        try:
            org = organization.objects.get(id = id)
            if not OrganizationsEvents.objects.filter(organization = org).exists():
                OrganizationsEvents.objects.create(organization = org)
            Orgs = OrganizationsEvents.objects.get(organization = org)
            serializer = OrganizationsEventsSerializer(Orgs)
            return Response(serializer.data , status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['GET'])
def getVerifiedEvents(request: HttpRequest):
    if request.method == 'GET':
        try:
            get = request.GET
            month = get['month']
            year = get['year']
            events = Event.objects.filter(verify = True, date_start__year = year, date_start__month = month)
            
            if 'search' in get:
                print(get['search'])
                events = events.filter(Q(name__icontains = get['search'].lower()) | Q(name__icontains = get['search'].title()) | Q(name__icontains = get['search'].upper()) )
            serializer = EventSerializer(events, many=True)
            
            return Response({ 'events':  serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def forgotPassword(request: HttpRequest):
    if request.method == 'POST':
        data = request.data
        if 'email' in data:
            try:
                if not User.objects.filter(username = data['email']).exists():
                    return Response({'error': 'Email not found'}, status=status.HTTP_400_BAD_REQUEST)
                sendRestorePassword.sendVerificated(data['email'],f'http://localhost:3000/resetPassword/{data["email"]}/')
                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['POST'])
def resetPassword(request: HttpRequest, email: str):
    if request.method == 'POST':
        data = request.data
        if 'password' in data:
            try:
                user = User.objects.get(username = email)
                user.set_password(data['password'])
                user.save()
                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['POST'])
def removePersonaEvent(request: HttpRequest):
    if request.method == 'POST':
        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization').split(' ')[1]
            if not authorizedToken.objects.filter(key=token).exists():
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            if not persona.objects.filter(user = authorizedToken.objects.get(key=token).user).exists():
                return Response({'error': 'You are not a persona'}, status=status.HTTP_401_UNAUTHORIZED)
            perso = persona.objects.get(user = authorizedToken.objects.get(key=token).user)
            data = request.data
            if 'id' in data:
                try:
                    event = Event.objects.get(id = data['id'])
                    if personaEvents.objects.filter(persona = perso).exists():
                        personaEvents.objects.get(persona = perso).events.remove(event)
                    return Response(status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': "Authorization header is missing"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['GET'])
def getEventsOnDay(request: HttpRequest):
    if request.method == 'GET':
        try:
            get = request.GET
            day = get['day']
            month = get['month']
            year = get['year']
            events = Event.objects.filter(date_start__year = year, date_start__month = month, date_start__day = day)
            if 'search' in get:
                events = events.filter(Q(name__icontains = get['search'].lower()) | Q(name__icontains = get['search'].title()) | Q(name__icontains = get['search'].upper()) )
            serializer = EventSerializer(events, many=True)
            return Response({ 'events':  serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    
@api_view(['GET'])
def getPersonas(request: HttpRequest):
    if request.method == 'GET':
        try:
            perso = persona.objects.all()
            if 'search' in request.GET:
                perso = perso.filter(Q(fio__icontains = request.GET['search'].lower()) | Q(fio__icontains = request.GET['search'].title()) | Q(fio__icontains = request.GET['search'].upper()) )
            serializer = personalSerializer(perso, many=True)
            return Response({ 'personas':  serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['POST'])
def addReport(request: HttpRequest):
    if request.method == 'POST':
        if request.headers.get('Authorization'):
            token = request.headers.get('Authorization').split(' ')[1]
            if not authorizedToken.objects.filter(key=token).exists():
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            if not organization.objects.filter(user = authorizedToken.objects.get(key=token).user).exists():
                return Response({'error': 'You are not an organization'}, status=status.HTTP_401_UNAUTHORIZED)
            organ = organization.objects.get(user = authorizedToken.objects.get(key=token).user)
            data = request.data
            if 'id' in data:
                try:
                    event = Event.objects.get(id = data['id'])
                    if OrganizationsEvents.objects.filter(organization = organ , events = event).exists():
                        if 'winner' in data and 'bolls' in data and 'problems' in data and 'helpers' in data:
                            report.objects.create(bolls = data['bolls'], problems = data['problems'], helpers = data['helpers'], event = event, winner = data['winner'])
                            event.ended = True
                            event.save_base()
                            return Response(status=status.HTTP_200_OK)
                        else:
                            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response({'error': 'Event is not in your organization'}, status=status.HTTP_400_BAD_REQUEST)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': "Authorization header is missing"}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
            