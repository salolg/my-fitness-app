from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import requests
import  json

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
ID = os.environ['ID']
PATH = os.environ['PATH_API']
API_KEY = os.environ['API_KEY']

def translate_en_to_pl(service, phrase):

    spreadsheet_id = ID

    values = [
        [
            phrase, '=GOOGLETRANSLATE(A2; "en"; "pl")'
        ],
    ]
    body = {
        'values': values
    }

    result = service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id, range='A2:B2',
        valueInputOption='USER_ENTERED', body=body).execute()


    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, range='B2').execute()
    rows = result.get('values', [])

    return rows[0][0]

def translate_pl_to_en(service, phrase):

    spreadsheet_id = spreadsheet_id = ID

    values = [
        [
            phrase, '=GOOGLETRANSLATE(A2; "pl"; "en")'
        ],
    ]
    body = {
        'values': values
    }

    result = service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id, range='A2:B2',
        valueInputOption='USER_ENTERED', body=body).execute()


    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, range='B2').execute()
    rows = result.get('values', [])

    return rows[0][0]
def main(word, en_to_pl):
    creds = None

    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)
    if en_to_pl:
        result = translate_en_to_pl(service,word)
    else:
        result = translate_pl_to_en(service, word)
    return result


def foodSearchFunction(generalSearchInput = ""):
    res = main(generalSearchInput, False)
    # print(res)
    params = {'generalSearchInput':res}
    headers = {'Content-type': 'application/json'}
    r = requests.post("https://api.nal.usda.gov/fdc/v1/search?api_key=" + API_KEY, json = params, headers = headers )
    if r.status_code == 200:
        body_unicode = r.content.decode('utf-8')
        body = json.loads(body_unicode)
        generalSearchInput = body['foods']
        prev_en = ""
        prev_pl = ""
        for i in generalSearchInput[:10]:
            if prev_en == i["description"]:
                i["description"] = prev_pl
            else:
                prev_en = i["description"]
                i["description"] = main(i["description"], True)
                prev_pl = i["description"]

            print(i["description"])

        return generalSearchInput[:10]
    else:
        return {"res" : "error"}


def foodDetailsDunction(fdcID):
    headers = {'Content-type': 'application/json'}
    res = requests.get("https://api.nal.usda.gov/fdc/v1/" + fdcID + API_KEY, headers=headers)
    body_unicode = res.content.decode('utf-8')
    body = json.loads(body_unicode)
    foodNutrients = body['foodNutrients']
    dataArray = []
    for i in foodNutrients:
        if 'id' in i.keys():
            if i['nutrient']['name'] == 'Energy' and i['nutrient']['unitName'] == 'kcal':
                field = {
                    "name" : i['nutrient']['name'],
                    "amount" : i['amount'],
                    "unit" : i['nutrient']['unitName']
                }
                dataArray.append(field)

            if i['nutrient']['name'] == 'Carbohydrates' or i['nutrient']['name'] == 'Carbohydrate, by difference':
                field = {
                    "name" : 'Węglowodany',
                    "amount" : i['amount'],
                    "unit" : i['nutrient']['unitName']
                }
                dataArray.append(field)
            if i['nutrient']['name'] == 'Protein':
                field = {
                    "name" : 'Białko',
                    "amount" : i['amount'],
                    "unit" : i['nutrient']['unitName']
                }
                dataArray.append(field)
            if i['nutrient']['name'] == 'Total lipid (fat)':
                field = {
                    "name": 'Tłuszcze',
                    "amount": i['amount'],
                    "unit": i['nutrient']['unitName']
                }
                dataArray.append(field)
    res = main(body['description'], True)
    result = {
        "name": res,
        "nutritiens" : dataArray
    }

    return result