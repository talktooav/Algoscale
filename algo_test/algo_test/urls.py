from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth.views import LogoutView
from users.views import LoginView

urlpatterns = [    
    path('logout/', LogoutView.as_view(), name='logout'),
    url(r'^login/$', LoginView.as_view(template_name='login.html'), name='login'),
    path('users/', include("users.urls", namespace='users'), name='users'),
    # ~ url(r'^admin/', admin.site.urls),
    
    
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
