from django import forms
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.contrib.auth.models import Group
from algo_test.validation import *
from django.forms.widgets import FileInput
from django.core.validators import FileExtensionValidator

from .models import User
from django.utils import timezone

class UserRegisterForm(forms.ModelForm):
    
    use_required_attribute = False
    
    name = forms.CharField(label='Name', max_length=50, min_length=2, error_messages={'required': 'The name field is required.'}, widget=forms.TextInput, validators=[lambda value: valid_name(value, 50, 'name')])
    email = forms.CharField(label='Email Id', max_length=50, error_messages={'required': 'The email id field is required.'}, widget=forms.TextInput, validators=[lambda value: valid_email(value, 'Email Id')])
    # ~ groups = forms.ModelChoiceField(label='Role', error_messages={'required': 'The role field is required.'}, widget=forms.Select, queryset=Group.objects.all().exclude(name='Admin'))
    password1 = forms.CharField(label='Password', max_length=15, error_messages={'required': 'The password field is required.'}, help_text='The password must contain one uppercase, one lowercase, one special character and one number and 6 to 15 characters in length.', widget=forms.PasswordInput, validators=[lambda value: valid_password(value, 'password')])
    password2         = forms.CharField(label='Confirm Password', max_length=15, error_messages={'required': 'The confirm password field is required.'}, widget=forms.PasswordInput)
    
    
    class Meta:
        model = User
        fields = ('name', 'email')
    
    
    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Password does not match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserRegisterForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        # ~ user.staff     = True
        user.is_active = True
        if commit:
            user.save()
        return user
        
        
    def __init__(self, *args, **kwargs):
        super(UserRegisterForm, self).__init__(*args, **kwargs)
        
        for field in self.fields:
            self.fields[field].widget.attrs.update({'class' : 'form-control input-lg'})
        
class LoginForm(forms.Form):
    email    = forms.EmailField(label='Email', min_length=2, max_length=50, error_messages={'required': 'The email id field is required.'},)
    password = forms.CharField(widget=forms.PasswordInput, error_messages={'required': 'The password field is required.'},)
    
    #use_required_attribute = False
    
    def __init__(self, request, *args, **kwargs):
        # ~ self.request = request
        super(LoginForm, self).__init__(*args, **kwargs)

    def clean(self):
        print('qs')
        request   = self.request
        data      = self.cleaned_data
        email     = data.get("email")
        password  = data.get("password")
        qs        = User.objects.filter(email=email)
        print('qs', qs)
        if qs.exists():
            # user email is registered, check active/
            not_active = qs.filter(is_active=False)
            print('not_active', not_active)
            if not_active.exists():
                raise forms.ValidationError("Your account is not active, please activate it.")
        user = authenticate(request, username=email, password=password)
        if user is None:
            raise forms.ValidationError("Invalid credentials")
        qs.update(last_modified=timezone.now())
        
        login(request, user)
        self.user = user
        return data
        
    def __init__(self, *args, **kwargs):
        # ~ self.request = self.request
        super(LoginForm, self).__init__(*args, **kwargs)
        
        for field in self.fields:
            self.fields[field].widget.attrs.update({'class' : 'form-control input-lg'})    
        
     
