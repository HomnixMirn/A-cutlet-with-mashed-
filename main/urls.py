from django.contrib import admin
from django.urls import path, re_path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # re_path(r'^api/students/$', views.students_list),
    re_path(r'^api/hacaton/get_code/$', get_code),
    re_path(r'^api/hacaton/get_organization/$', getOrganization),
    re_path(r'^api/hacaton/register/$', register),
    re_path(r'^api/hacaton/login/$', login),
    re_path(r'^api/hacaton/logout/$', logout),
    re_path(r'^api/hacaton/personalInfo/$', personalInfo),
    re_path(r'^api/hacaton/redactPersonalInfo/$',redactPersonal),
    re_path(r'^api/hacaton/getTekEvent/$', getTekEvent),
    re_path(r'^api/hacaton/createEvent/$', createEvent),
    re_path(r'^api/hacaton/verifyEvent/$', verifyEvent),
    re_path(r'^api/hacaton/deleteEvent/$', deleteEvent),
    re_path(r'^api/hacaton/getNotVerifiedEvent/$', getNotVerifiedEvents),
    re_path(r'^api/hacaton/addEventToPerson/$', addEventToPersonal ),
    re_path(r'^api/hacaton/getOrganizationInfo/(?P<id>[0-9]+)$', getOrganizationsInfo ),
    re_path(r'^api/hacaton/getVerifiedEvents/(?P<id>[0-9]+)$', getVerifiedEvents ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)   