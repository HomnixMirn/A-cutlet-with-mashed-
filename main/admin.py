from django.contrib import admin
from .models import *
# Register your models here.

@admin.register(code)
class codeAdmin(admin.ModelAdmin):
    list_display = ('code', 'email')
    
@admin.register(organization)
class orgAdmin(admin.ModelAdmin):
    list_display = ('region', 'fio', 'email')
    
@admin.register(lastIvent)
class lastIventAdmin(admin.ModelAdmin):
    list_display = ('city', 'mens', 'discipline', 'title', 'format', 'date_start', 'date_end')