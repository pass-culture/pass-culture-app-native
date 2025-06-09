# Refonte Architecture App

## Constat

L’app jeunes a été construite sur la base d’hypothèses qui ne permettent pas toujours la scalabilité: garantie de la performance/stabilité/maintenabilité.

## Hypothèses historiques

Les hypothèses historiques (implicites ou explicites) sont les suivantes:

- gestion de l’état faite de plusieurs manières (sans séparation de l’app/server state):
  - component states -> état locaux très proches des composants, s’utilise via useState et permet de stocker des états éphémères (en théorie)
  - hooks -> permettent de stocker des états de façon déportée par rapport au state des composants, et de le partager avec d’autres composants (introduction possible de couplages).
  - Context -> permettent de passer de l’information d’un composant parent vers n’importe quel composant enfant de son arbre, quelle que soit le niveau d’encapsulation
  - zustand (minoritaire) -> store de gestion d’états locaux, zustand permet la gestion des états (majoritairement app state) de façon unitaire: un store correspond à une partie du code (feature, page, etc…)
  - react query (partiellement) -> gestionnaire d’état server, react-query permet de gérer tous les appels réseaux, de s’assurer de l’optimisation de la bande passante par la gestion du cache, de créer et de stocker tout l’état server par un système de clés.
  - firebase (ff, remote config) -> store distant permettant d’influer sur le comportement de l’app (ici par les features flags/remote config), peut aussi être utilisé pour stocker de la donnée utilisateur, faire du tracking etc…
- gestion des logiques métiers
  - hooks (encapsulés sur plusieurs étages) -> permettent de créer des logiques communes entre plusieurs composants (couplage possible)
  - fonctions dans les composants (non testées directement)
- gestion de la navigation
  - react-navigation et paramètres d’url
  - states dans des hooks/components/contexts

## Pain points principaux

- gestion de l’état app/server non séparés
- utilisation trop systématique des Contexts
- logiques métiers non isolées (hooks de hooks)
- logiques métiers non testées unitairement (dans des contextes complexes au mieux)
- navigation reconstruite via un état hybride qui vient à la fois de l’url et de contextes / états internes de l’app
- tous les components de l’app accèdent à des états server et app sans restrictions

## Implications des choix en place

- gestion de l’état app/server non séparés

  - très compliqué de gérer le mode offline de l’app (sauvegarde du server state pour afficher l’app sans réseau)
  - complexité augmentée lors de modifications
  - difficile/impossible de comprendre le transit de la data dans l’app, d’isoler son point de départ/d’arrivée et les étapes de transformations subies -> typage lâche, fonctions de traitement de la donnée non apparentes, couplage entre états, maintenabilité compromise

- utilisation trop importante des Contexts

  - re-render massifs quand le Context est modifié -> lors de la modification de l’état d’un contexte tous les enfants sont re-render dans l’arbre que le Context englobe
  - complexité de dév, le state des Contexts peut influencer des state locaux à distance (effets de bords/couplage de partie de code/modularité faible voire inexistante)

- logiques métiers non isolées (hooks de hooks)

  - difficile/impossible de développer sereinement sans risque de casser des logiques métiers lors de l’ajout/modification de features
  - dépendance de hooks vers d’autres hooks (effets de bords/couplage de partie de code/modularité faible voire inexistante)

- logiques métiers non testées unitairement (dans des contextes complexes au mieux)

  - difficile/impossible de développer sereinement sans risque de casser des logiques métiers lors de l’ajout/modification de features
  - difficile/impossible de comprendre le code legacy; bloque la maintenance du code, rend difficile de challenger le code (logique métiers non comprises/oubliées -> le code ne permet pas de comprendre)

- navigation reconstruite via un état hybride qui vient à la fois de l’url et de contextes / états internes de l’app

  - deeplinks impossibles (sur les écrans à état hybrides) -> l’état ne peut pas être recréé par la lecture seule d’une URL (stateful vs stateless)
  - logiques compliquées voire impossibles à modifier lors de l’ajout de features
  - testabilité faible
  - tests e2e très compliquées à mettre en oeuvre: besoin d’une url + du contexte de l’app pour arriver à un état testable

- tous les components de l’app accèdent à des états server et app sans restrictions
  - pas de distinction entre un composant de navigation (page), d’affichage (component) et un composant de logique (container)
  - les composants dont l’état ne provient pas exclusivement des props nécessitent un contexte (server & app state, context, mock des data contenues dans des hooks etc…) afin de pouvoir être testés
  - couplage fort
  - effets de bords: modification d’un état dans l’app peut modifier plusieurs composants à priori non liés à cet état
  - aucun composant n’est une fonction pure: testabilité faible
  - maintenabilité compliquée: isoler les composants d’affichage permet d’effectuer des évolutions de code sans se préoccuper du contexte.

## Propositions

### Séparation des états

Pourquoi vouloir séparer les États dans l’app ?
Être incapable de découpler les états qui viennent du server de ceux générer par l’app (user), empêche une gestion propre du cache, du stockage de data pour le mode offline, et entraîne un couplage non désirable pour l’évolution de l’app / la recherche et la gestion des bugs.

### Server State

Le server state concerne tous les calls d’API qui sont nécessaires au fonctionnement de l’app:

- backend passculture
- firebase (ff, remote config)
- algolia (recherche, playlists)
- contentful (édito)

On veut pouvoir gérer ces appels réseaux de la manière la plus uniforme possible.
Le choix technique qui a été fait à la genèse de l’app est React-Query.
On veut uniformiser la façon dont est utilisée la librairie dans l’app pour extraire et isoler l’état serveur.
On veut que pour toutes les requêtes réseaux la librairie RQ soit utilisée.

Le but est d’uniformiser, isoler et identifier le server state dans l’app.

### App State

L’app state concerne tous les états produits par l’utilisateur qui ne sont pas le reflet direct de la donnée serveur.
On veut que ces états soit gérés de façon uniforme, pour cela il faudra:

- supprimer les contextes inutiles
- déplacer les states locaux (components/hooks) vers des stores zustand
- les stores devront être unitaires: separation of concern, le rôle de chaque store doit être identifié et identifiable

Le but est d’uniformiser, isoler et identifier l’app state dans l’app.

### Suppression des Contexts

Une grande partie des contextes React sera supprimée, au profit de l’utilisation de stores zustands pour l’app state et de queries pour le server state.
Cf. partie précédente

### Logiques métiers

Toutes les logiques métiers doivent être isolées dans des fonctions.  
Ces fonctions constitueront un ensemble uniforme et identifiable de règles qui seront testées unitairement.
La notion de classe peut être remplacée par l’utilisation des modules JS et de fonctions dans cette portée.
Pour cela, on effectuera les modifications suivantes:

- suppression des hooks associés au server state, utilisation de fonction de sélection (select de RQ ou selector de Reselect): ces fonctions permettent de modifier la donnée server pour l’affichage
- suppression des hooks d’abstraction d’actions au profit de fonctions pures: testables car stateless
- suppression des logiques métiers dans les components, les logiques seront extraites et transformées en fonctions pures.

### Navigation

Toutes les pages seront accessibles par des urls et aucune autre donnée ne devra être nécessaire pour y accéder, à part les données de connexions, et celles de localisation, toutes les deux très liées à l’état server/app de l’utilisateur.

Pour cela il faut un principe bi-directionnel entre l’état et l’URL:

- que toutes les pages possèdent des urls
- que tous les paramètres des urls déterminent l’état d’affichage de la page
- que tous les états soient déterminé par les paramètres de l’url, sauf cas particulier pour des pages qui n’auront pas besoin d’être accessibles en deeplink

### Séparation des types de composants

Tous les composants de l’app devront se ranger dans une des catégories suivantes:

- dumb component: les dumb components (affichage) devront constituer la majorité de la codebase, il ne pourront pas contenir de logique métier, ils devront être des fonctions pures leur état n’est déterminé que par les props.
- container: les containers seront connectés aux stores pour l’app state et au server state. Il devront gérer leur logique métier dans des fonctions pures (cf. partie sur la logique métier).
- page: les pages sont les composants de plus haut niveau et doivent déterminer leur état interne uniquement via les paramètres de l’url (sauf exceptions).

Pour cela il faut:

- repérer et isoler dumbs components dans des dossiers spécifiques
- remonter les logiques contenues dans les composants d’affichage vers les containers et les pages
- supprimer les connexions entre les composants d’affichage aux stores et au server state
- isoler les containers dans des dossiers spécifiques
- modifier les pages pour ne calculer leur état que à partir de l’url

## Roadmap

### Étapes

- L’audit de l’archi + archi macro 90% achevé
- Les principes T2
- VALIDÉ PAR EM SUR LA VISION 2025
- Séparation des états de l’app T3…
- Suppression des contexts au profit des autres états
- Fonctionnalisation des logiques métiers
- Séparation des types de composants
- Refonte de la navigation
- Quels sont les pré-requis avant de laisser en T3 les devs faire les nouvelles features avec ces nouveaux principes ?
- En T3 il faudra trouver les stratégies pour modifier le légacy

Toutes les étapes sont citées dans un ordre de faisabilité préférentielle, néanmoins une fois la séparation des états de l’app effectuée toutes les autres étapes sont faisables en parallèle si besoin.

### Lots

#### Séparation des états de l’app

##### Server State: isolation des queries

- isolation des queries: lors de cette étape on isole toutes les queries RQ que l’on met dans un dossier queries qui se trouve lui même dans le dossier de la feature considéré
- communalisation des queries: lors de cette étape les queries communes sont déplacées dans un dossier queries à la racine des sources du projet
- transformation des appels réseaux vanilla pour utiliser RQ
- utilisation d'une API unique: typage du select pour éviter aux développeur un typage boilerplate trop lourd

##### App State: isolation vers les stores

- transformation des états internes de l’app (les plus importants ne se trouvant pas dans des stores) vers zustand
- uniformisation de la création des stores et de leur utilisation -> api unique

#### Gestion du mode offline

- règle de persistance de requêtes (firebase, remoteConfig, user, token)
- uniformisation du cache RQ et persistance
- hydratation du server et app state au launch de l’app (ex placehoder data vs initial query data)
- Suppression des Contexts
- Identification des contexts importants: lors de cette étape, on identifie quels sont les Contexts qui sont les plus importants dans l’app: état d’authentification, localisation, snackbar, accessibility …
- challenge de la nécessité d’utiliser les Contexts
- suppression de tous les Contexts jugés comme inutiles
- chaque Context sera migré vers des stores zustand
- toutes les logiques s’appuyant sur ces Contexts seront réécrites pour se connecter à des stores

#### Fonctionnalisation des logiques métiers

Isolation des logiques métiers:

- transformation des hooks contenant l’intelligence métier en fonctions pures
- mises en places de tests descriptifs des logiques métiers
- utilisation des selectors (fonctions pures de selection) pour transformer la data server là où c’est nécessaire

#### Séparation des types de composants

- création de nouveaux composants containers (cf. ci-dessous)
- déplacement des connexions à l’app/server state dans les containers
- migrations de tous les autres composants vers des dumbs components
- les composants pages existant déjà il faudra simplement s’assurer que ces composants appellent bien des containers et non des dumb components autant que possible

#### Refonte de la navigation

- réécriture de l’arbre de navigation, listant toutes les pages et les paramètres nécessaires pour y arriver
- validation que toutes les pages de l’app sont accessibles en deeplink (si ce n’est pas le cas, devra être justifié)
- création d’un système de modales uniformisé qui centralise tous les affichages de modales
