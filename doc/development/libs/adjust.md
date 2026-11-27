
# [Adjust](https://dev.adjust.com/en/sdk/react-native/)

Dans le cas de tests sur des évènements trackés une seule fois, le cache doit être nettoyé. Pour cela, déconnecter le compte, supprimer l'application, eteindre le serveur puis relancer un serveur :
```bash
yarn start --reset-cache
```
enfin, build l'app à nouveau.

### [Pour check sur Adjust :](https://help.adjust.com/fr/article/testing-console)

* Se connecter au compte dev adjust
* Autoriser le suivi des activités sur le téléphone pour iOS
* Télécharger l’app Adjust Insights sur le store android/iOS ou récupérer l’[id du simulateur](https://dev.adjust.com/en/sdk/react-native/features/device-info) 
* Copier son idfa obtenu dans Adjust Insights dans la console de test Adjust (App View -> Gestion des données -> Console de test)
* Voir si le sdk doit être lancé en sandbox
* Ouvrir l’app pass culture : Accepter le suivi des activités, accepter les cookies : sinon le sdk Adjust ne se lance pas
* Sur android c’est gps_adid.


### Sur simulateur:

* Aller dans le fichier Adjust.ts
* Commenter les ligne qui désactivent le sdk en DEV
* Décommenter la ligne sur les logiciels verbose
* Aller dans les loges du run en cours dans Xcode -> console : Filtrer les logs sur Adjust pour voir tous les events, etc qui sont envoyées. 
    
