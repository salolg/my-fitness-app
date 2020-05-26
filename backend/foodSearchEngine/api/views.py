from rest_framework.decorators import api_view
from django.http import JsonResponse
from . import functions
import json
class SearchEngine(object):
    @staticmethod
    @api_view(['POST'])
    def foodSearch(request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        generalSearchInput = body['generalSearchInput']
        res = functions.foodSearchFunction(generalSearchInput)
        result = {"result" : res}
        return JsonResponse(result)

    @staticmethod
    @api_view(['POST'])
    def foodDetails(request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        fdcId = body['fdcId']
        result = functions.foodDetailsDunction(fdcId)
        print(result)
        return JsonResponse(result)
