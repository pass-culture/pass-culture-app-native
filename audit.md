# Audit Technique du Code

## Audit de différents parcours

### Chargement Initial et Accueil

#### Observations

* Le fichier `src/features/home/pages/Home.tsx` contient de nombreux hooks dont plusieurs `useEffect`
* on a des durées éparpillées dans la codebase
    * `src/features/home/constants.ts`
* sur [Sentry, `accueil-thematique`](https://pass-culture.sentry.io/insights/frontend/pageloads/overview/?environment=production&project=4508839229718608&statsPeriod=7d&transaction=%2Faccueil-thematique) fait parti des pages avec un score de performance faible et pourtant très visité
    * Largest Contentful Paint ~10s : 10s parfois jusqu'à 15s pour complètement charger la page
    * Interaction to Next Paint 1s : l'app freeze pendant 1s

#### Points de friction

* Utiliser de nombreux hooks peut engendrer des problèmes de performance en causant de nombreux re-render

#### Recommandations

* Utiliser un state manager (comme Zustand) pour centraliser les états de l'application et limiter le nombre de hooks utiliser pour limiter le nombre de re-render

### Réalisation d’une Recherche

#### Observations

* `src/features/search/helpers/useSync/useSync.ts` hook permettant de synchroniser la navigation avec les états des contextes de recherche et de localisation

#### Points de friction

* `src/features/search/helpers/useSync/useSync.ts` difficile à maintenir, source de bug

#### Recommandations

* l'URL devrait etre la source de véritée
* pour les états locaux (ex : localisation), le stata manager (Zustand) devrait etre la source de vérité

### Réserve d’une Offre

#### Observations

* sur une page offre, pour déterminer quel bouton afficher (ex : "Résverver") le comportement que le bouton doit avoir, on utilise le hook `src/features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction.ts`
    * ce hook est décomposé en 2 parties
        * un hook qui montre le hook hell dans lequel nous sommes : un hook qui appelle plein de hooks pour récupérer toutes les informations nécessaires et les passer à la fonction suivante
        * une fonction pure avec niveau de compléxité cognitive de 58
* [des problèmes de performances ont été identifié sur les modales avec les boutons primary](https://github.com/pass-culture/pass-culture-app-native/pull/8064#discussion_r2065954706), obligeant les tests end to end à faire certains click 2 fois pour etre certains que ça passe

#### Points de friction

* le hook `src/features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction.ts` est trop complexe, le rendant difficile à maintenir et difficile de dire avec assurance quel bouton sera affiché dans telle situation

#### Recommandations

### Activation d’un Compte

#### Observations

#### Points de Friction

#### Recommandations

## Conclusion

### Recommandations

* Suivre les préconnisations de la guilde architecture
    * découper :
        * composant Page : qui fait les requetes
        * composant Container : qui centralise les logiques en appelant des fonctions pures
        * composant débile pure : qui ne font que de l'affichage
    * gestion des états
        * URL comme source de vérité
        * utilisation de react-query pour toutes les requetes
        * cache de react-query utilisés pour éviter de refaire des requetes inutiles tout en limitant le cache en mémoire
        * utilisation de Zustand pour centraliser les états locaux de l'app
