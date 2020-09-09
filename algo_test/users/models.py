from datetime import timedelta
from django.conf import settings
from django.urls import reverse
from django.db import models
from django.db.models import Q
from django.utils import timezone

from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, AbstractUser, Group
)
from django.template.loader import get_template

from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import ugettext_lazy as _

from .UserManager import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    username          = models.CharField(max_length=50, default='', blank=True, null=True)
    email             = models.EmailField(_('email id'), max_length=80, unique=True)
    name              = models.CharField(_('name'), max_length=30, blank=True)
    createdAt         = models.DateTimeField(_('created at'), default=timezone.now)
    last_modified     = models.DateTimeField(_('last modified'), auto_now=True)
    ip_address        = models.TextField(_('ip address'), default='')
    is_active         = models.BooleanField(_('active'), default=False)
    staff             = models.BooleanField(default=False) # staff user non superuser
    admin             = models.BooleanField(default=False) # superuser
    is_deleted        = models.IntegerField(_('is deleted'), default=0)
    
    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
    
    
