getScreenFromDeeplink
 getScreenFromDeeplink()
- should return PageNotFound when route is unknown
- should return PageNotFound when prefix is not in known config
- should return Home
- should also work with a different accepted prefix
- should return ProfileStackNavigator when url = /profil
- should return SearchStackNavigator when url = /recherche/resultats
- should return SearchStackNavigator when url = /recherche/accueil
- should return SearchFilter when url = /recherche/filter
- should return SearchStackNavigator when url = /recherche/thematic
- should return Offer with id=666

