from django.conf.urls import url
from .views import *

app_name = "users"
urlpatterns = [
        url(r'^listing', UserAjaxView.as_view(), name='user-ajax-view'),
        url(r'^user/$', UserListView.as_view(), name='users'),
        url(r'^sign-up/$', RegisterView.as_view(), name='add-user'),
        url(r'^user/delete/$', UserDeleteView.as_view(), name='user-delete')
]

