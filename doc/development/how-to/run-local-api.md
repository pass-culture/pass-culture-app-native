## Développement avec une API locale

### Backend

Pour lancer le backend, suivez les instructions disponibles dans [backend](https://github.com/pass-culture/pass-culture-main/#api).

En résumé, si vous avez déjà configuré le dépôt :

- lancez Docker ;
- exécutez `pc start-backend` (ou redémarrez-le si nécessaire) ;
- exécutez `pc sandbox -n industrial` pour peupler la base de données.

> ✅ Vérification : vous pouvez accéder à votre [Swagger local](http://localhost/native/v1/swagger#/default/get_).

Passons maintenant au frontend.

### Frontend

L'API locale est disponible sur `http://localhost:5001` (Flask) et `http://localhost` (Nginx, port 80). Utilisez `http://localhost:5001` afin que cela corresponde à la commande `adb reverse` pour Android (voir ci-dessous).

#### Application web

Pour lancer l'application web, exécutez `API_BASE_URL=http://localhost:5001 yarn start:web:testing` (la variable d'environnement remplace la valeur définie dans `.env.testing` ; il n'est donc pas nécessaire de modifier ce fichier).

Pour accéder à l'application web depuis un autre appareil, consultez la section [Tester l'application web sur un appareil réel avec ngrok](./test-webapp-on-device-ngrok.md).

#### Application mobile

Pour que l'application mobile effectue ses requêtes vers le backend, vous devez soit modifier la variable `API_BASE_URL` en `http://localhost:5001` dans le fichier `.env.testing` et reconstruire l'application, soit modifier [cette ligne](https://github.com/pass-culture/pass-culture-app-native/blob/master/src/api/api.ts#L7) :

```diff
-   basePath: env.API_BASE_URL,
+   basePath: 'http://localhost:5001',
```

> Assurez-vous d'être déconnecté(e) avant d'effectuer cette modification. En effet, les identifiants utilisateur (user IDs) différeront entre votre backend local et la base de données de test.

> **/!\ Ne validez pas (commit) ces modifications ; elles doivent rester locales.**

### Limitations

Étant donné que le backend diffère entre l'environnement local et l'environnement de test, vous ne pourrez pas :

- voir les images des offres ;
- accéder aux détails d'une offre (identifiant incorrect) ;
- et, par conséquent, réserver une offre ou l'ajouter à vos favoris.

Vous pouvez toutefois accéder à l'application et devriez être en mesure de contourner ces limitations.

### Android – « Network request failed » (Échec de la requête réseau)

Sur un appareil Android ou un émulateur, `localhost` désigne l'appareil lui-même. Si vous rencontrez l'erreur « Network request failed » en essayant de connecter un appareil Android à votre backend exécuté localement, effectuez une redirection de port (« port forwarding ») vers votre ordinateur :

```
adb reverse tcp:5001 tcp:5001
```

Sur un émulateur, vous pouvez également utiliser `http://10.0.2.2:5001` (l'adresse de la machine hôte) au lieu de `http://localhost:5001`.
