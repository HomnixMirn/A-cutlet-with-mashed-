from django.contrib import admin
from .models import *
# Register your models here.

@admin.register(code)
class codeAdmin(admin.ModelAdmin):
    list_display = ('code', 'email')
    
@admin.register(organization)
class orgAdmin(admin.ModelAdmin):
    list_display = ('region', 'fio', 'email')
