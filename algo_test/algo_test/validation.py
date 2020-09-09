from django import forms
import re
from django.core.exceptions import ValidationError

def valid_email(value, label):
    regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'
    if value == None:
        raise forms.ValidationError("The {} field is required.".format(label))
    elif re.search(regex,value) == None:
        raise forms.ValidationError('Please enter valid {}.'.format(label))
            
def valid_name(value, length, label):
    regex    = re.compile("^[a-zA-Z \.\-]{2,50}$")
    validate = regex.search(value)
    if value == None:
        raise forms.ValidationError("The {} field is required.".format(label))
    elif validate == None:
        raise forms.ValidationError("Please enter valid {}.".format(label))
        
def valid_password(value, label):
    regex = re.compile('^(?=\S{6,15}$)(?=.*?\d)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[^A-Za-z\s0-9])')        
    validate = regex.search(value)
    if value and validate == None:
        raise forms.ValidationError('Please enter valid password.')
    elif value == None:
        raise forms.ValidationError('The {} field is required.'.format(label))    
