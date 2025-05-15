# Audit Technique du Code

## Audit de différents parcours

### Chargement Initial

#### Observations

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

#### Points de Friction

- Utiliser des contextes peut engendrer des problèmes de performance en causant des re-render d'une grande partie de l'arborecanse de composants

#### Recommandations

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
  - probablement une fonction à appeler directement dans App
    - `AnalyticsInitializer`
    - `FirestoreNetworkObserver`
  - TBD mécanisme global
    - `SnackBarProvider`
      - supprimer ces contexts au passage
        - `OfflineModeContainer` supprimer complètement lorsqu'on retravaillera l'offline
    - pareil pour les modales
      - supprimer ces contexts au passage
        - `PushNotificationsWrapper`
        - `ShareAppWrapper`
    - `NetInfoWrapper` centraliser les requetes
  - TBD lorsqu'on s'en occupera
    - `Suspense` à supprimer ? à bouger top level ?
    - `ScreenErrorProvider` je ne sais pas encore mais pas de cette manière
    - `SplashScreenProvider` revoir le splash screen et la navigation pour supprimer ce context
    - `SupportedBrowsersGate`
      - revoir le wording du bouton qui est trop long
      - vérifier que ça fonctionne sur ces browsers
      - bump aux versions réellement supportées
        - aligner le reste du projet
          - `src/cheatcodes/pages/others/CheatcodesNavigationNotScreensPages.tsx`
          - la [config `browserslist`](https://browsersl.ist/) utilisée par vite
    - `GoogleOAuthProvider` est-ce qu'il ne pourrait pas etre bougé au moins dans le bundle qui contient l'inscription et la connexion ?

### Accueil

#### Observations

- Le fichier `src/features/home/pages/Home.tsx` contient de nombreux hooks dont plusieurs `useEffect`
- on a des durées éparpillées dans la codebase
  - `src/features/home/constants.ts`
- sur [Sentry, `accueil-thematique`](https://pass-culture.sentry.io/insights/frontend/pageloads/overview/?environment=production&project=4508839229718608&statsPeriod=7d&transaction=%2Faccueil-thematique) fait parti des pages avec un score de performance faible et pourtant très visité
  - Largest Contentful Paint ~10s : 10s parfois jusqu'à 15s pour complètement charger la page
  - Interaction to Next Paint 1s : l'app freeze pendant 1s

#### Points de friction

- Utiliser de nombreux hooks peut engendrer des problèmes de performance en causant de nombreux re-render

#### Recommandations

- Utiliser un state manager (comme Zustand) pour centraliser les états de l'application et limiter le nombre de hooks utiliser pour limiter le nombre de re-render

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

safeFetch -> axios [axios-auth-refresh](https://www.npmjs.com/package/axios-auth-refresh) / [XHRInterceptor](https://nikunj09.medium.com/intercept-http-request-in-react-native-1f07754e12d1)

useSafeState

[React Query] [Test] (la suite)
En réutilisant la config de react-query de production pour les tests, on s'est aperçue que la doc dit de mettre [une config particulière pour les tests](https://github.com/pass-culture/pass-culture-app-native/pull/8108/files#diff-47cca32323f1c6e76693acd86657e71cac0b7e2cdda86fd2c490b3359e4c026bR14)

on a [une config de prod de react-query](https://github.com/pass-culture/pass-culture-app-native/blob/25d03eaf31efb53cd50d71a973c8561f419d18b1/src/libs/react-query/queryClient.ts#L9) qui n'est pas bonne pour des raisons historiques :
1️⃣ `retry: 0`
en mettant en place le refresh token, [on a supprimé les retries](https://github.com/pass-culture/pass-culture-app-native/pull/234/commits/64e9c2a0227c061df857b366d352718fd26718b5#diff-26ad4b834941d9b19ebf9db8082bd202aaf72ea0ddea85f5a8a0cb3c729cc6f2R53)

@Bruno Peyrou a émis l'hypothèse que c'est pour éviter de faire des requetes plusieurs fois lorsque le token est expiré

si une requete échoue (ex : mauvais réseau, je suis dans le train, je passe sous un tunnel), l'app ne réessaie pas de faire la requete

par défaut, react-query [réessaie chaque requete 3 fois](https://tanstack.com/query/latest/docs/framework/react/guides/query-retries), ce qui pourrait faire diminuer nos erreurs liés aux réseaux ([top 1 :first_place_medal: erreurs sur Sentry](https://pass-culture.sentry.io/issues/?environment=production&groupStatsPeriod=auto&project=4508839229718608&query=&referrer=issue-list&sort=freq&statsPeriod=30d) en nombre d'occurrences d'erreurs)

@Mathieu Meissonnier a créé [un ticket](https://passculture.atlassian.net/browse/PC-36132) pour profiter du retry par défaut sans spammer pour rien lorsque le refresh token expire

on a d'[autres pistes](https://www.npmjs.com/package/axios-auth-refresh) https://nikunj09.medium.com/intercept-http-request-in-react-native-1f07754e12d1 pour gérer ce cas d'erreur (et se débarrasser de [`safeFetch` qui fait peur](https://github.com/pass-culture/pass-culture-app-native/blob/be07b683df6bb2364bfcdd16841b7ed5ab350ec2/src/api/apiHelpers.ts#L59))

2️⃣ `useErrorBoundary: true`
pour [une raison encore plus historique](https://github.com/pass-culture/pass-culture-app-native/pull/125/files#diff-26ad4b834941d9b19ebf9db8082bd202aaf72ea0ddea85f5a8a0cb3c729cc6f2R30), lorsqu'une requete échoue, on affiche une page d'erreur

on n'essaie pas de la gérer localement

pour [certaines requetes définissent des valeurs par défaut](https://github.com/pass-culture/pass-culture-app-native/blob/e235c64aae55b08c1e29f695ed63f68486de6895/src/libs/subcategories/useSubcategories.ts#L17), qui sont utilisées lors du premier render (avant que la requete soit finie) et en cas d'erreurs

meme si on fourni une valeur par défaut qui non-idéale mais suffisante, lorsqu'il y a une erreur, on affiche la page d'erreur

si on veut utiliser la valeur par défaut en cas d'erreur, avec notre config actuelle, [il faut le demander explicitement](https://github.com/pass-culture/pass-culture-app-native/blob/4401026df896c9b97a823a01712ebcb3469cabd7/src/libs/firebase/remoteConfig/queries/useRemoteConfigQuery.ts#L32)

la guilde archi changera probablement ce comportement à terme

---

finalement, on essaie d'avoir [une config de react-query dans les tests](https://github.com/pass-culture/pass-culture-app-native/pull/8108/files#diff-47cca32323f1c6e76693acd86657e71cac0b7e2cdda86fd2c490b3359e4c026bR14) qui est différente de celle de la prod, comme le recommande la doc

ça implique de mettre `retry: 0` donc comme ce qu'on a en prod et qu'on aimerait se débarrasser ; dans le contexte de tests, c'est la config recommandée

en faisant ça, [on a +1 à +4 re-render de tous les composants testés par les tests de perfs](https://github.com/pass-culture/pass-culture-app-native/actions/runs/15026218287/job/42227520992?pr=8108#step:6:98)

on a cherché à comprendre, on faisant un focus sur `<SearchResults />` (car il a +4 re-render), on a été confronté au hook hell de cette page, pour le moment, on ne comprends pas

pourquoi lorsqu'on passe de `retry: 3` (config par défaut de react-query) à `retry: 0`, on a plus de re-render ?

est-ce qu'on accepte ces perfs en tant que nouvelles base de performance ?
