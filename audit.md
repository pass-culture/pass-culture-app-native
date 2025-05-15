# Audit Technique du Code

## Audit de différents parcours

### Chargement Initial et Accueil

#### Observations

- Le fichier `src/features/home/pages/Home.tsx` contient de nombreux hooks dont plusieurs `useEffect`
- on a des durées éparpillées dans la codebase
  - `src/features/home/constants.ts`
- sur [Sentry, `accueil-thematique`](https://pass-culture.sentry.io/insights/frontend/pageloads/overview/?environment=production&project=4508839229718608&statsPeriod=7d&transaction=%2Faccueil-thematique) fait parti des pages avec un score de performance faible et pourtant très visité
  - Largest Contentful Paint ~10s : 10s parfois jusqu'à 15s pour complètement charger la page
  - Interaction to Next Paint 1s : l'app freeze pendant 1s
- Nous avons actuellement beaucoup de `Provider` / `Context`
  - Mobile & Web
    - `ReactQueryClientProvider`
    - `ThemeWrapper`
    - `ThemeProvider`
    - `SafeAreaProvider`
    - `ErrorBoundary`
    - `SettingsWrapper`
    - `AuthWrapper`
    - `LocationWrapper`
    - `AccessibilityFiltersWrapper`
    - `FavoritesWrapper`
    - `SearchAnalyticsWrapper`
    - `SearchWrapper`
    - `SnackBarProvider`
    - `CulturalSurveyContextProvider`
    - `SubscriptionContextProvider`
    - `ScreenErrorProvider`
  - Mobile
    - `AnalyticsInitializer`
    - `NetInfoWrapper`
    - `FirestoreNetworkObserver`
    - `SplashScreenProvider`
    - `PushNotificationsWrapper`
    - `ShareAppWrapper`
    - `OfflineModeContainer`
  - Web
    - `SupportedBrowsersGate`
    - `GoogleOAuthProvider`
    - `AppWebHead`
    - `Suspense`

#### Points de friction

- Utiliser de nombreux hooks peut engendrer des problèmes de performance en causant de nombreux re-render
- Utiliser des contextes peut engendrer des problèmes de performance en causant des re-render d'une grande partie de l'arborecanse de composants

#### Recommandations

- Utiliser un state manager (comme Zustand) pour centraliser les états de l'application et limiter le nombre de hooks utiliser pour limiter le nombre de re-render
- Remplacer les contextes
  - À garder
    - `ReactQueryClientProvider`
    - `ThemeProvider`
    - `SafeAreaProvider`
    - `ErrorBoundary` il faudrait expérimenter d'en ajouter à des niveaux plus bas, sur les parties qui peuvent échouer indépendamment sans impacter le reste de l'app
    - `AppWebHead`
  - À remplacer par un store Zustand
    - `ThemeWrapper`
    - `LocationWrapper`
    - `AccessibilityFiltersWrapper`
    - `SearchAnalyticsWrapper`
    - `SubscriptionContextProvider`
  - À remplacer par react-query
    - `SettingsWrapper`
    - `AuthWrapper` à rediscuté pour le refresh token qui est stocké
    - `FavoritesWrapper`
  - Source de vérité venant des query params / URL
    - `SearchWrapper`
    - `CulturalSurveyContextProvider` et / ou react-hook-form, ou Zustand, ou faire une requete au backend pour envoyer la réponse partielle, ou au minimum mettre ce Context qu'au niveau du Navigator
  - TBD mécanisme global
    - `SnackBarProvider`
    - pareil pour les modales
  - TODO trier
    - `Suspense` à supprimer ? à bouger top level ?
    - `ScreenErrorProvider`
    - `AnalyticsInitializer`
    - `NetInfoWrapper`
    - `FirestoreNetworkObserver`
    - `SplashScreenProvider`
    - `PushNotificationsWrapper`
    - `ShareAppWrapper`
    - `OfflineModeContainer`
    - `SupportedBrowsersGate`
    - `GoogleOAuthProvider`

### Réalisation d’une Recherche

#### Observations

- `src/features/search/helpers/useSync/useSync.ts` hook permettant de synchroniser la navigation avec les états des contextes de recherche et de localisation
- sur la page thématic search `src/features/gtlPlaylist/hooks/useGTLPlaylists.ts` il y a une cascade de requetes

#### Points de friction

- `src/features/search/helpers/useSync/useSync.ts` difficile à maintenir, source de bug
- les hooks en cascades sont complexes à gérer
  - notamment à cause des données absentes lors du premier rendus

#### Recommandations

- l'URL devrait etre la source de véritée
- pour les états locaux (ex : localisation), le stata manager (Zustand) devrait etre la source de vérité
- les requetes devraient etre gérées au niveau de la page

### Réserve d’une Offre

#### Observations

- sur une page offre, pour déterminer quel bouton afficher (ex : "Réserver") le comportement que le bouton doit avoir, on utilise le hook `src/features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction.ts`
  - ce hook est décomposé en 2 parties
    - un hook qui montre le hook hell dans lequel nous sommes : un hook qui appelle plein de hooks pour récupérer toutes les informations nécessaires et les passer à la fonction suivante
    - une fonction pure avec niveau de compléxité cognitive de 58
- [des problèmes de performances ont été identifié sur les modales avec les boutons primary](https://github.com/pass-culture/pass-culture-app-native/pull/8064#discussion_r2065954706), obligeant les tests end to end à faire certains click 2 fois pour etre certains que ça passe

#### Points de friction

- le hook `src/features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction.ts` est trop complexe, le rendant difficile à maintenir et difficile de dire avec assurance quel bouton sera affiché dans telle situation

#### Recommandations

### Activation d’un Compte

#### Observations

#### Points de Friction

#### Recommandations

## Conclusion

### Recommandations

- Suivre les préconnisations de la guilde architecture
  - découper :
    - composant Page : qui fait les requetes
    - composant Container : qui centralise les logiques en appelant des fonctions pures
    - composant débile pure : qui ne font que de l'affichage
  - gestion des états
    - URL comme source de vérité
    - utilisation de react-query pour toutes les requetes
    - cache de react-query utilisés pour éviter de refaire des requetes inutiles tout en limitant le cache en mémoire
    - utilisation de Zustand pour centraliser les états locaux de l'app

TODO

safeFetch -> axios axios-auth-refresh / XHRInterceptor https://nikunj09.medium.com/intercept-http-request-in-react-native-1f07754e12d1

useSafeState
