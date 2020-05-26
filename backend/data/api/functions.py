from pymongo import MongoClient
db_name = 'MyFitnessAppUsers'
db_collection = 'CountriesList'

def get_countries_list():
    client = MongoClient('localhost', 27017)
    db = client[db_name]
    collection = db[db_collection]
    document = collection.find({})
    listOfCountries = []
    for i in document:
        for c in i["listOfCountries"]:
            listOfCountries.append({"value" : c["name_pl"], "label" :c["name_pl"] })
    print(listOfCountries)
    return listOfCountries