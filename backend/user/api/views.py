from rest_framework.decorators import api_view
from django.http import JsonResponse
from . import userMelasInfo
import json
class UserClass(object):
    @staticmethod
    @api_view(['POST'])
    def get_all_user_info_by_token(request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        token = body['userToken']
        result = userMelasInfo.get_all_user_info_by_token(token)
        return JsonResponse(result)

    @staticmethod
    @api_view(['POST'])
    def update_user(request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        token = body['userToken']
        dataUrodzenia = body['dataUrodzenia']
        plec = body['plec']
        krajZamieszkania = body['krajZamieszkania']
        wzrost = body['wzrost']
        waga = body['waga']
        kalorie = body['kalorie']
        currentDate = body['currentDate']
        print(token)
        print(dataUrodzenia)
        print(plec)
        print(krajZamieszkania)
        print(wzrost)
        print(waga)
        print(kalorie)
        print(currentDate)
        result = userMelasInfo.update_user_information_in_database(token, dataUrodzenia, plec, krajZamieszkania, wzrost, waga, kalorie, currentDate)
        result = {}
        return JsonResponse(result)


    @staticmethod
    @api_view(['POST'])
    def create_user(request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        nazwaUzytkownika = body['nazwaUzytkownika']
        token = body['userToken']
        dataUrodzenia = body['dataUrodzenia']
        plec = body['plec']
        krajZamieszkania = body['krajZamieszkania']
        wzrost = body['wzrost']
        waga = body['waga']
        kalorie = body['kalorie']
        currentDate = body['currentDate']
        result = userMelasInfo.insert_new_user_to_database(nazwaUzytkownika, token, dataUrodzenia, plec, krajZamieszkania, wzrost, waga, kalorie, currentDate)
        result = {}
        return JsonResponse(result)


    @staticmethod
    @api_view(['GET', 'POST'])
    def get_user_meals_by_user_token_view(request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        userToken = body['userToken']
        date = body['date']
        result = userMelasInfo.get_user_meals_by_user_token(userToken, date)
        return JsonResponse(result)

    @staticmethod
    @api_view(['POST'])
    def update_meal(request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        token = body['token']
        nazwaProduktu = body['nazwaProduktu']
        liczbaPorcji = body['liczbaPorcji']
        wielkoscPorcji = body['wielkoscPorcji']
        liczbaKalorii = body['liczbaKalorii']
        klucz =  body['klucz']
        data = body['dzien']
        nazwaPosilku = body['nazwaPosilku']
        bialko =  body['bialko']
        weglowodany = body['weglowodany']
        tluszcze = body['tluszcze']
        result = userMelasInfo.update_meal_data(token, data, nazwaPosilku, nazwaProduktu, liczbaPorcji,
                                                wielkoscPorcji, liczbaKalorii, klucz, bialko, weglowodany, tluszcze)
        result = {}
        return JsonResponse(result)

    @staticmethod
    @api_view(['POST'])
    def delete_meal(request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        token = body['token']
        klucz = body['klucz']
        data = body['dzien']
        nazwaPosilku = body['nazwaPosilku']
        kalorie = body['kalorie']
        bialko = body['bialko']
        tluszcze = body['tluszcze']
        weglowodany = body['weglowodany']
        result = userMelasInfo.delete_meal_in_database(token, data, nazwaPosilku, klucz, kalorie, bialko, tluszcze, weglowodany)
        result = {}
        return JsonResponse(result)

    @staticmethod
    @api_view(['POST'])
    def add_water(request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        token = body['token']
        data = body['dzien']
        wartosc = body['wartosc']
        result = userMelasInfo.addWater(token, data, wartosc)
        result = {}
        return JsonResponse(result)