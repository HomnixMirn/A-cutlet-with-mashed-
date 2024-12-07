from rest_framework import serializers
from .models import *



class OrganizationSerializer(serializers.ModelSerializer):

    # number_region = serializers.SerializerMethodField()

    class Meta:
        model = organization
        fields = ['id','region', 'fio', 'email','admin']

    # def get_number_region(self, obj):
        
    #     # name = translit(obj.region, 'ru', reversed=True)

    #     for subdivision in pycountry.subdivisions.get(country_code='RU'):
    #         # print(subdivision.name)
            
    #         #AttributeError: 'NoneType' object has no attribute 'group'
    #         try:

    #             print(1)
    #         except AttributeError:
    #             name = subdivision.name
    #         print(name)
    #         if obj.region == name:
                
    #             return f"{subdivision.code}"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']
    
    
class personalSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = persona
        fields = ['user', 'name', 'id_user', 'fio', 'phone', 'born_date', 'sex', 'country', 'region', 'city', 'user','id']


class EventSerializer(serializers.ModelSerializer):
    organization = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = "__all__"

    def get_organization(self, obj):
        org_events = OrganizationsEvents.objects.filter(events=obj).first()
        if org_events:
            return OrganizationSerializer(org_events.organization).data
        return None
        
        
        
class OrganizationsEventsSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True)
    organization = OrganizationSerializer()
    class Meta:
        model = OrganizationsEvents
        fields = "__all__"
        
class PersonaEventsSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True)
    persona = personalSerializer()
    class Meta:
        model = personaEvents
        fields = "__all__"