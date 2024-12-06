from rest_framework import serializers
from .models import *
import pycountry


class OrganizationSerializer(serializers.ModelSerializer):
    # мне надо чтобы number_region зависел от region и имел значение region+1
    number_region = serializers.SerializerMethodField()

    class Meta:
        model = organization
        fields = ['region', 'fio', 'email', 'number_region']

    def get_number_region(self, obj):
        
        return f" {obj.region} + 1"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']
    
    
class personalSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = persona
        fields = ['user', 'name', 'id_user', 'fio', 'phone', 'born_date', 'sex', 'country', 'region', 'city', 'user']


        
        
        
