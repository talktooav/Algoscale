from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.urls import reverse, reverse_lazy
from django.core.paginator import Paginator
from django.views.generic import CreateView, FormView, View, ListView, DeleteView
from django.shortcuts import render, redirect, get_object_or_404

from django.http import HttpResponseRedirect
from algo_test.utils import get_client_ip

from django.utils import timezone
from django.contrib.auth.models import Group
from django.template.loader import render_to_string, get_template

from django.http import JsonResponse
from django.db.models import Q
from algo_test.mixins import NextUrlMixin, RequestFormAttachMixin
from .forms import *
from .models import User


class LoginView(NextUrlMixin, RequestFormAttachMixin, FormView):
    form_class    = LoginForm
    # ~ success_url   = '/'
    template_name = 'login.html'
    # ~ default_next  = '/dashboard'
    
    def get(self, request, *args, **kwargs):
        form = self.form_class()
        return render(request, self.template_name, {'form' : form})
    
    
    def post(self, request, *args, **kwargs):
        
        form = self.form_class(self.request.POST)
        
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        if email and password:
            user_obj = User.objects.filter(email=email, is_deleted=0)
            if user_obj.exists():
                not_active = user_obj.filter(is_active=False)
                if not_active.exists():
                    return redirect('/users/sign-up/')
                    
            user = authenticate(request, username=email, password=password)
            if user is None:
                return redirect('/users/sign-up/')
            
            request.session['username'] = email
            user_obj.update(last_modified=timezone.now())
        
            login(request, user)
            return redirect('/users/user')
        else:
            messages.error(self.request, 'Please enter valid credentials')         
        
        # ~ return render(request, self.template_name, {'form' : form})
        # ~ if form.is_valid():
            # ~ var      = self.request.session.items()
            # ~ user_id  = list(var)[0][1]
            
            # ~ user = User.objects.get(id=user_id)
            # ~ user.last_modified = timezones()
            # ~ user.ip_address    = get_client_ip(self.request)
            # ~ user.save()
            
            # ~ next_path = '/dashboard'
            # ~ return redirect(next_path)
        # ~ else:
            # ~ return redirect('/users/sign-up/')
        
    # ~ def form_valid(self, form):
        # ~ var      = self.request.session.items()
        # ~ user_id  = list(var)[0][1]
        
        # ~ user = User.objects.get(id=user_id)
        # ~ user.last_modified = timezones()
        # ~ user.ip_address    = get_client_ip(self.request)
        # ~ user.save()
        
        # ~ next_path = '/'+user_slug+'/dashboard'
        # ~ return redirect(next_path)


class RegisterView(View):
    form_class          = UserRegisterForm
    initial             = {'key' : 'value'}
    template_name       = 'users/add.html'
    
    def get(self, request, *args, **kwargs):
        form = self.form_class(initial=self.initial)
        return render(request, self.template_name, {'form' : form})

    def post(self, request, *args, **kwargs):
        if self.request.method == "POST" and self.request.is_ajax():
            
            form        = self.form_class(request.POST,request.FILES)
            name        = request.POST.get('name')
            email       = request.POST.get('email')
            role        = request.POST.get('groups')
            password1   = request.POST.get('password1')   
            context = {
                'form' : form
            }
            
            if form.is_valid():
                
                # ~ try:
                user  = form.save()
                    
                # ~ user.date_joined       = timezones() 
                user.createdAt         = timezone.now() 
                user.ip_address        = get_client_ip(self.request) 
                user.last_modified     = timezone.now() 
                user.save()
                
                user_login = authenticate(request, username=email, password=password1)
                request.session['username'] = email
                login(request, user_login)
                return JsonResponse({"success" : True, 'redirect_url' : reverse('users:users'), 'msg' : 'Record has been submit successfully'}, status=200)
                # ~ except:
                    # ~ return JsonResponse({"success" : False, 'msg' : 'Some error has been occurred.'}, status=200)
            else:
               return JsonResponse({"success" : False, 'errors' : form.errors.as_json()}, status=200)
            
            return JsonResponse({"success":False}, status=400)    
        


#LoginRequiredMixin, PermissionRequiredMixin,  
class UserListView(LoginRequiredMixin, ListView):
    template_name       = 'users/listing.html'
    model               = User

class UserAjaxView(ListView):
    model               = User
    template_name       = 'users/ajax_listing.html'
    paginate_by         = 10
    permission_required = "users.view_user"
    
    def get(self, request, *args, **kwargs):
        
        
        page         = request.GET.get('page', 1)
        
        user_obj = User.objects.filter(is_deleted=0).order_by('-id').values('id', 'name', 'email', 'createdAt')
        
        total_count = user_obj.count()
        if total_count == 0:
            total_count = 'No'
        paginator   = Paginator(user_obj, self.paginate_by)
        try:
            devices = paginator.page(page)
        except PageNotAnInteger:
            devices = paginator.page(1)
        except EmptyPage:
            devices = paginator.page(paginator.num_pages)
            
        if request.is_ajax():
            context                = dict()
            context['object_list'] = devices
            context['pagination']  = 'base/pagination.html'
            
            html_form = render_to_string(
                self.template_name, {'context' : context}, request)
            html_pagi = render_to_string(
                'base/pagination.html', {'context' : context}, request)
            return JsonResponse({'html': html_form, 'pagination' : html_pagi, 'total_records' : str(total_count)+' records found'})
        else:
            return super().get(request, *args, **kwargs)
        return JsonResponse(data)

    
class UserDeleteView(LoginRequiredMixin, DeleteView):
    model               = User
    template_name       = 'users/listing.html'
    
    def get(self, request, *args, **kwargs):
        context = dict()
        if request.is_ajax():
            try:
                html_form = render_to_string('base/confirm_delete.html', context, request)
            except:
                html_form = render_to_string(self.template_name, context, request)           
    
            return JsonResponse({'html': html_form})
        else:
            return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        
        try: 
        
            ids = self.request.POST.getlist('ids[]')
            try:
                if ids:
                    for user_id in ids:
                        user_obj = User.objects.filter(id=user_id)
                        if user_obj:
                            user_obj.update(is_deleted=1)
                    return JsonResponse({"success" : True, 'msg' : 'User has been successfully removed.'}, status = 200)        
            except:
                return JsonResponse({"success" : False, 'msg' : 'Some error has been occurred, please try again.'}, status = 200)
                                            
            return JsonResponse({'data' : ''}, status = 200)
        except:
            return JsonResponse({"success" : False, 'msg' : 'Some error has been occurred, please try again.'}, status = 200)
