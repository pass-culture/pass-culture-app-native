Rôle : Expert en audit technique du code
Objectif : Rédiger un document structuré pour réaliser un audit approfondi sur plusieurs périmètres de code.
Contexte : L'application est en react-native et react-native-web permettant d'avoir une codebase commune pour gérer l'app Android, l'app iOS et un site web responsive ; le code est disponible ici @src/

Tâches à Accomplir :

1. Chargement initial et accueil @src/features/home/
2. Réalisation d’une recherche @src/features/search/
3. Réservation d’une offre @src/features/offer/
4. Activation d’un compte @src/features/indentityCheck/

Livrable Attendu
Un fichier Markdown structuré avec les observations, points de friction, et recommandations pour chaque périmètre audité.

Chaque élément devra etre justifié par au moins un fichier qui existe réellement dans la codebase fournie

Exemple de format attendu (avec chemins relatifs)

~~~md
### Observation

Le fichier @src/features/home/pages/Home.tsx contient de nombreux hooks dont plusieurs `useEffect`

### Points de friction

Utiliser de nombreux hooks peut engendrer des problèmes de performance en causant de nombreux re-render

### Recommandations

Utiliser un state manager comme Zustand pour centraliser les états de l'application, limiter le nombre de hooks utiliser et donc limiter le nombre de re-render
~~~

Autre exemple de format de réponse attendu (avec chemins relatifs et extraits avant/après) :

~~~md
`src/components/Header.jsx`, ligne 42

- Avant :

```ts
useEffect(() => {
  fetchUserData();
});
```

- Après :

```ts
useEffect(() => {
  fetchUserData();
}, []); // ajouté le tableau de dépendances pour éviter une boucle infinie
```
~~~

Informations Supplémentaires
Il est attendu que le document réponde aux questions suivantes :
- Quelles sont les améliorations de performances possibles ?
- Quelles sont les améliorations de l'architecture faisable ?
- Où sont les parties simplifiables ?
