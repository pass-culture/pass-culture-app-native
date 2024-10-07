# Migration Firebase

## Paramétrage du projet

### Web

- ✅ (Web) Modifier la configuration web (fichier .env)

### iOS

- ✅ (iOS) Remplacer le fichier GoogleService-Info.plist (local)
- ⬜️ (iOS) Remplacer le fichier GoogleService-Info.plist (CI)

### Android

- ✅ (Android) Remplacer le fichier google-service.json (local)
- ⬜️ (Android) Remplacer le fichier google-service.json (CI)

## Firestore

### Droits

- ✅ Configurer les droits en lecture

### Feature flags

- ✅ (Firebase) - Transfert des FF
- ✅ (Repo) - Récupérer les FeaturesFlags

### Application version

- ✅ (Repo) - Modifier le couple collection/doc
- ✅ (Repo) - Mettre à jour les tests

### Cookies last update

- ✅ (Repo) - Modifier le couple collection/doc
- ✅ (Repo) - Mettre à jour les tests

### Maintenance

- ✅ (Repo) - Modifier le couple collection/doc
- ✅ (Repo) - Mettre à jour les tests

### Ubble

- ✅ (Repo) - Modifier le couple collection/doc
- ✅ (Repo) - Mettre à jour les tests

## Remote config

- ⬜️ (Firebase) - Transfert des remotes config
- ⬜️ (Repo) - Récupération des remotes config

## Dynamic Links

- ⬜️ (Firebase) Transférer les liens
- ⬜️ (Firebase) Vérifier le bon fonctionnement des liens

## Debug view

- ✅ Vérifier le bon fonctionnement et la remontée des events sur la Debug View

## Events (Analytics)

- ✅ S'assurer de la bonne remontée des events sur la console Events
