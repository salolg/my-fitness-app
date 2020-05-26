from pymongo import MongoClient
db_name = 'MyFitnessAppUsers'
db_collection = 'UserData'

def get_all_user_info_by_token(token):
    client = MongoClient('localhost', 27017)
    db = client[db_name]
    collection = db[db_collection]
    document = collection.find({"token": token})
    record = document[0]
    return record

def update_user_information_in_database(token, dataUrodzenia, plec, krajZamieszkania, wzrost, waga, kalorie, currentDate):
    client = MongoClient('localhost', 27017)
    db = client[db_name]
    collection = db[db_collection]
    document = collection.find({"token": token})
    record = document[0]
    record["plec"] = plec
    record["kraj"] = krajZamieszkania
    record["dataUrodzenia"] = dataUrodzenia
    record["wzrost"] = wzrost
    record["liczbaKaloriiDziennie"] = kalorie
    record["waga"].append({"data":currentDate,"wartoscWagi":waga})
    collection.update({"token": token}, {"$set": record}, upsert=False)
    return 0



def insert_new_user_to_database(nazwaUzytkownika, token, dataUrodzenia, plec, krajZamieszkania, wzrost, waga, kalorie, currentDate):
    client = MongoClient('localhost', 27017)
    db = client[db_name]
    collection = db[db_collection]
    print(collection)

    dict = {"nazwaUzytkownika":nazwaUzytkownika,
            "plec":plec,
            "kraj":krajZamieszkania,
            "dataUrodzenia":dataUrodzenia,
            "token": token,
            "wzrost":wzrost,
            "liczbaKaloriiDziennie":kalorie,
            "waga":[
                {"data":currentDate,"wartoscWagi":waga}
            ],
            "kalendarzPosilkow":{
                currentDate:{
                    "sumaBialka" : 0,
                    "sumaTluszczy" : 0,
                    "sumaWeglowodanow" : 0,
                    "liczbaKaloriiZProduktow" : 0,
                    "sniadanie":[],
                    "obiad":[],
                    "przekaski":[],
                    "kolacja":[]
                }
            }
            }

    response = collection.insert_one(dict)
    print(response)
    return 0

def get_user_meals_by_user_token(userToken, date):
    client = MongoClient('localhost', 27017)
    db = client[db_name]
    collection = db[db_collection]
    document = collection.find({"token" : userToken})
    record = document[0]
    if date in record["kalendarzPosilkow"]:
        print("jest")
    else:
        record["kalendarzPosilkow"][date] = {
                    "sumaBialka": 0,
                    "sumaTluszczy": 0,
                    "sumaWeglowodanow": 0,
                    "liczbaKaloriiZProduktow" : 0,
                    "sniadanie":[],
                    "obiad":[],
                    "przekaski":[],
                    "kolacja":[],
                    "woda": 0,
                }
        ret = collection.update({"token": userToken}, {"$set": record}, upsert=False)
    document = collection.find({"token": userToken})
    record = document[0]
    record.update({'_id': "id"})
    print(record)

    return record


def update_meal_data(token, data, nazwaPosilku, nazwaProduktu, liczbaPorcji,
                     wielkoscPorcji, liczbaKalorii, klucz, bialko, weglowodany, tluszcze):
    client = MongoClient('localhost', 27017)
    db = client[db_name]
    collection = db[db_collection]
    rekord = collection.find_one({"token": token})
    kluczNieIstnieje = True
    rekord["kalendarzPosilkow"][data]["liczbaKaloriiZProduktow"] = rekord["kalendarzPosilkow"][data]["liczbaKaloriiZProduktow"] + float(liczbaKalorii)
    rekord["kalendarzPosilkow"][data]["sumaBialka"] = rekord["kalendarzPosilkow"][data]["sumaBialka"] + float(bialko)
    rekord["kalendarzPosilkow"][data]["sumaTluszczy"] = rekord["kalendarzPosilkow"][data]["sumaTluszczy"] + float(tluszcze)
    rekord["kalendarzPosilkow"][data]["sumaWeglowodanow"] = rekord["kalendarzPosilkow"][data]["sumaWeglowodanow"] + float(weglowodany)
    for i in rekord["kalendarzPosilkow"][data][nazwaPosilku]:
        print("i: ")
        print(i)
        if i["key"]==klucz:
            kluczNieIstnieje = False
            i["nazwaProduktu"] = nazwaProduktu
            i["liczbaKalorii"] = liczbaKalorii
            i["wielkoscPorcji"] = wielkoscPorcji
            i["liczbaPorcji"] = liczbaPorcji
            i["bialko"] = bialko,
            i["weglowodany"] = weglowodany,
            i["tluszcze"] = tluszcze

    if kluczNieIstnieje:
        produkt = {
            "key": klucz,
            "nazwaProduktu" : nazwaProduktu,
            "liczbaKalorii" : liczbaKalorii,
            "liczbaPorcji" : liczbaPorcji,
            "wielkoscPorcji" : wielkoscPorcji,
            "bialko" : bialko,
            "weglowodany" : weglowodany,
            "tluszcze" : tluszcze
        }
        print("")
        print(produkt)
        result = rekord["kalendarzPosilkow"][data][nazwaPosilku].append(produkt)
        print(result)

    collection.update({"token": token}, {"$set": rekord}, upsert=False)
    rekord = collection.find_one({"token": token})
    print(rekord)

def delete_meal_in_database(token, data, nazwaPosilku, klucz, kalorie, bialko, tluszcze, weglowodany):
    print(token)
    print(data)
    print(nazwaPosilku)
    print(klucz)

    client = MongoClient('localhost', 27017)
    db = client[db_name]
    collection = db[db_collection]
    rekord = collection.find_one({"token": token})
    rekord["kalendarzPosilkow"][data]["liczbaKaloriiZProduktow"] = rekord["kalendarzPosilkow"][data]["liczbaKaloriiZProduktow"] - float(kalorie)
    rekord["kalendarzPosilkow"][data]["sumaBialka"] = rekord["kalendarzPosilkow"][data]["sumaBialka"] - float(bialko)
    rekord["kalendarzPosilkow"][data]["sumaTluszczy"] = rekord["kalendarzPosilkow"][data]["sumaTluszczy"] - float(tluszcze)
    rekord["kalendarzPosilkow"][data]["sumaWeglowodanow"] = rekord["kalendarzPosilkow"][data]["sumaWeglowodanow"] - float(weglowodany)
    print(rekord["kalendarzPosilkow"][data]["liczbaKaloriiZProduktow"])
    for i in rekord["kalendarzPosilkow"][data][nazwaPosilku]:
        if i["key"] == klucz:
            rekord["kalendarzPosilkow"][data][nazwaPosilku].remove(i)
    collection.update({"token": token}, {"$set": rekord}, upsert=False)
    return 0

def addWater(token, data, wartosc):
    client = MongoClient('localhost', 27017)
    db = client[db_name]
    collection = db[db_collection]
    rekord = collection.find_one({"token": token})
    rekord["kalendarzPosilkow"][data]["woda"] =  rekord["kalendarzPosilkow"][data]["woda"] + wartosc
    collection.update({"token": token}, {"$set": rekord}, upsert=False)
    return 0