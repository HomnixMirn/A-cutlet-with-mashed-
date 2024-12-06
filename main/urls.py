from django.contrib import admin
from django.urls import path, re_path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # re_path(r'^api/students/$', views.students_list),
    re_path(r'^api/hacaton/get_code/$', get_code),
    re_path(r'^api/hacaton/get_organization/$', getOrganization),
    #TODO: repath
    re_path(r'^api/hacaton/register/$', register),
    re_path(r'^api/hacaton/login/$', login),
    re_path(r'^api/hacaton/logout/$', logout),
    re_path(r'^api/hacaton/personalInfo/$', personalInfo),
    re_path(r'^api/hacaton/redactPersonalInfo/$',redactPersonal),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)   