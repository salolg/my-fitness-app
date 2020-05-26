from rest_framework.decorators import api_view
from django.http import JsonResponse
from . import functions
import json
class Data(object):
    @staticmethod
    @api_view(['GET'])
    def get_countries_names(request):
        result = functions.get_countries_list()
        response = {"res" : result}
        return JsonResponse(response)