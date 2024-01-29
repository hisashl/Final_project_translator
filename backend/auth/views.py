from django.shortcuts import render
from . import views
from django.http import HttpResponse    
# Create your views here.

def home(request):
    return HttpResponse('Hola gael')