# 🌈 Suivi des corrections d’accessibilité

| Plateforme | Conformité | 07 juillet | 26 septembre | 31 octobre | 19 novembre | 15 décembre |
| ---------- | ---------- | ---------- | ------------ | ---------- | ----------- | ----------- |
| Android    | RAAM 1.1   | 35.71%     | 44.19%       | ⏳         | ⏳          | ⏳          |
|            | EN 301-549 | 35.42%     | 37.50%       | ⏳         | ⏳          | ⏳          |
| iOS        | RAAM 1.1   | 28.57%     | 41.86%       | ⏳         | ⏳          | ⏳          |
|            | EN 301-549 | 20.83%     | 25.00%       | ⏳         | ⏳          | ⏳          |

<br>

## 📋 Légende

🟠 : Correction disponible à la vérification  
🟢 : Correction validée  
🔴 : Correction invalidée  
⏳ : Questions en attente de réponse

<br>

## ✅ Corrections 26 août → 26 septembre

<details>

<summary> 🔴🟢 Critère 1.1 - Android - Chaque élément graphique de décoration est-il ignoré par les technologies d’assistance ?</summary>

**RAAM** : [Critère 1.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-1-1)  
**Ticket** : [PC-37377](https://passculture.atlassian.net/browse/PC-37377)  
**PR** : [#8676](https://github.com/pass-culture/pass-culture-app-native/pull/8676)

**Problème** 😱

- Les emojis étaient vocalisé sur Android car on utilisait `accessibilityHidden` qui ne fonctionne pas.
- Les icons qui étaient présent au début des boutons sont vocalisé "zéro" pour la même raison.

**Correction** 💡

- Refacto du code de `AccessibleTitle` et utilisation de `accessibilityElementsHidden` (iOS) et `importantForAccessibility` (Android) via `hiddenFromScreenReader()` pour ignorer les emojis. Création d'un composant `AccessibleTitle` spécifique web qui permet de garder `aria-hidden` en web pour éviter les problèmes de compatibilité.
- Utilisation du nouveau composant `LinkInsideText` qui ne possède pas d'emojis de lien externe.

**Retours audit** 🔥

iOS : OK

Android : NOK

- (E06) Les puces de listes ont une description similaire (vocalisée "zéro") -> OK elle sont ignorée, mais on peut toujours les atteindre +(nouvelle NC en 7.2)

</details>

<br>

<details>

<summary> 🟢🟢 Critère 1.2 - Chaque élément graphique porteur d’information possède-t-il une alternative accessible aux technologies d’assistance ?</summary>

**RAAM** : [Critère 1.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-1-2)  
**Ticket** : [PC-37462](https://passculture.atlassian.net/browse/PC-37462)  
**PR** : [#8653](https://github.com/pass-culture/pass-culture-app-native/pull/8653)

**Problème** 😱

- Pour les SVG, `accessiblityHidden` ne fonctionne pas (car n'existe pas en `react-native`).
- Pour le QR code, il n'est pas accessible au lecteur d'écrans.
- Pour les illustrations des offres et lieux, `accessibilityLabel` n'est pas très clair et compréhensible.

**Correction** 💡

- Pour les SVG, utiliser `accessible` plutôt que `accessiblityHidden`, qui rend disponible l'élément aux lecteurs d'écrans.
- Pour le QR code, il faut ajouter un `accessibilityLabel`, un `accessibilityRole` image et un `accessible` pour rendre la view disponible aux lecteurs d'écrans.
- Pour les illustrations des offres et lieux, il faut simplement changer `accessibilityLabel` pour qu'il soit plus explicite.

</details>

<br>

<details>

<summary> 🟢🟢 Critère 2.3 - Dans chaque écran, les couleurs utilisées dans les composants d’interface et les éléments graphiques porteurs d’informations sont-elles suffisamment contrastées ?</summary>

**RAAM** : [Critère 2.3](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-2-3)  
**Ticket** : [PC-37465](https://passculture.atlassian.net/browse/PC-37465)  
**PR** : [#8577](https://github.com/pass-culture/pass-culture-app-native/pull/8577)

**Problème** 😱  
La bordure du cercle dans les radio button n’était pas suffisamment contrastée pour être visible de tous.

**Correction** 💡  
Utilisation du design token `border.default` à la place de `border.subtle`.

</details>

<br>

<details>

<summary> 🔴🔴 Critère 7.1 - b) Dans chaque écran, l’information est-elle structurée par l’utilisation appropriée de titres ?</summary>

**RAAM** : [Critère 7.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-7-1)  
**Ticket** : [PC-37481](https://passculture.atlassian.net/browse/PC-37481)  
**PR** : [#8561](https://github.com/pass-culture/pass-culture-app-native/pull/8561)

**Problème** 😱  
Les titres n’avaient pas de rôle car nous avons ajouté `AccessibilityRole.HEADING` uniquement en web. De plus, ce rôle n’a aucune correspondance en native.

**Correction** 💡  
Utilisation de `AccessibilityRole.HEADER` dans `getHeadingAttrs()` qui permet d’ajouter le rôle dans tous les titres de manière automatique.

**Retours audit** 🔥

iOS : NOK

Android : NOK

- (E04) Les textes "Non conformité", "Dérogation pour charge disproportionnée", "Contenus non soumis à l'obligation d'accessibilité", "Technologies utilisées pour la réalisation de l'application", "Agent utilisateurs, technologies d'assistance et outils utilisés pour vérifier l'accessibilité". Corrections : Le texte "État de conformité" doit être identifié comme un titre (niveau 2 si possible) avec les propriétés natives, par exemple : accessibilityHeading sur Android

- (E09) Le texte "Lieu - Audit Access42". Corrections : Le texte "Lieu - Audit Access42" doit être identifié comme un titre (niveau 1 si possible) avec les propriétés natives, par exemple : accessibilityHeading sur Android. Si possible :

  - Le texte "Modalité de retrait" (niveau 3 si possible)
  - Le texte "Description" (niveau 3 si possible)
  - Le texte "Contact" (niveau 3 si possible)
  - Le texte "Accessibilité" (niveau 3 si possible) (dans ce bloc, sur le même principe, les éléments qui ouvre et ferme du contenu devraient également faire l'objet d'une hiérarchie avec un titrage du contenu)
  - Le texte "Horaires d'ouverture (niveau 3 si possible)

- (E14) Le texte "Rechercher" KO. Corrections : Le texte "Rechercher" doit être identifié comme un titre avec les propriétés natives, par exemple : accessibilityHeading sur Android. Autre cas : Le texte "Livres" (niveau 1 si possible) KO

iOS

</details>

<br>

<details>

<summary> 🔴🔴 Critère 7.2 - iOS - Dans chaque écran, chaque liste est-elle correctement structurée ?</summary>

**RAAM** : [Critère 7.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-7-2)  
**Ticket** : [PC-37482](https://passculture.atlassian.net/browse/PC-37482)  
**PR** : [#8607](https://github.com/pass-culture/pass-culture-app-native/pull/8607)

**Problème** 😱  
Certaines listes n’étaient pas identifiées comme des listes `<ul>` et `<li>`.

**Correction** 💡  
Utilisation des composants `Li` associés à des `AccessibilityRole.LIST`.

**Retours audit** 🔥

Android : OK

iOS : NOK

(E02) Les options de recherche dans la modale "Localisation"

(E04) Par exemple :

- Les listes du bloc "Non conformité"
- Les contenus dérogés
- Les technologies utilisées
- Les agents utilisateurs, technologies d'assistance et outils utilisés

(E06) L'ensemble des éléments

Corrections :
Identifier ces éléments comme des listes : créer un container de listes avec List pour iOS.
Dans le cas de contenus HTML (contenus web embarqués), veiller à utiliser les balises HTML appropriées pour créer des listes

</details>

<br>

<details>

<summary> 🟢🟢 Critère 8.1 - Dans chaque écran, le contenu visible porteur d’information est-il accessible aux technologies d’assistance ?</summary>

**RAAM** : [Critère 8.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-1)  
**Ticket** : [PC-37483](https://passculture.atlassian.net/browse/PC-37483)  
**PR** : [#8579](https://github.com/pass-culture/pass-culture-app-native/pull/8579), [#8662](https://github.com/pass-culture/pass-culture-app-native/pull/8662)

**Problème** 😱  
Certains textes n’étaient pas vocalisés car ils n’étaient pas inclus dans les labels.

**Correction** 💡

- Ajout d’informations dans certains `accessibilityLabel` et/ou suppression d’`accessibilityLabel` inutiles afin d’éviter toute confusion.
- Modification de `tileAccessibilityLabel` pour prendre en compte les tags.

</details>

<br>

<details>

<summary> 🟢🟢 Critère 8.5 - iOS - Dans chaque écran, pour chaque élément recevant le focus, la prise de focus est-elle visible ?</summary>

**RAAM** : [Critère 8.5](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-5)  
**Ticket** : [PC-37485](https://passculture.atlassian.net/browse/PC-37485)  
**PR** : [#8632](https://github.com/pass-culture/pass-culture-app-native/pull/8632)

**Problème** 😱  
Lorsqu'on navigue sur l'élément `Accordion` le focus n'était pas visible car on utilisait `touchableFocusOutline()` dans un composant `TouchableOpacity`

**Correction** 💡  
L'utilisation de `customFocusOutline()` plutôt que `touchableFocusOutline()` dans le composant `Accordion`

</details>

<br>

<details>
<summary> 🟢🟢 Critère 9.5 - b) Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent ?</summary>

**RAAM** : [Critère 9.5](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-9-5)  
**Ticket** : [PC-37491](https://passculture.atlassian.net/browse/PC-37491)  
**PR** : [#8593](https://github.com/pass-culture/pass-culture-app-native/pull/8593)

**Problème** 😱  
`accessibilityDescribedBy` n'est pas reconnu en native, ce qui vocalise les UUID.

**Correction** 💡  
`accessibilityHint` permet d'ajouter un élément complémentaire et doit être utilisé à la place.  
Cependant, il n'est pas utilisable sur les textes ; il faut utiliser un `accessibilityLabel` custom (ex : pour les messages d'erreur).  
On ignore les textes/éléments ajoutés dans `accessibilityHint` pour éviter une double vocalisation en utilisant `hiddenFromScreenReader()` avec :

- `accessibilityElementsHidden: true // iOS`
- `importantForAccessibility: 'no' // Android`

</details>

<br>

## ✅ Corrections 26 septembre → 31 octobre

<details>

<summary> 🟠 Critère 1.1 - Android - Chaque élément graphique de décoration est-il ignoré par les technologies d’assistance ?</summary>

**RAAM** : [Critère 1.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-1-1)  
**Ticket** : [PC-38204](https://passculture.atlassian.net/browse/PC-38204)  
**PR** : [#8741](https://github.com/pass-culture/pass-culture-app-native/pull/8741)

**Problème** 😱

- **(E06)** Les puces de listes sont ignorée, mais on peut toujours les atteindre.


**Correction** 💡

- **(E06)** On utilisait une balise de `Text` plutôt qu'une `View` et prenait ne focus.

</details>

<br>

<details>

<summary> 🟠 Critère 1.9 - Chaque élément graphique légendé est-il correctement restitué par les technologies d’assistance ?</summary>

**RAAM** : [Critère 1.9](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-1-9)  
**Ticket** : [PC-37464](https://passculture.atlassian.net/browse/PC-37464)  
**PR** : [#8762](https://github.com/pass-culture/pass-culture-app-native/pull/8762)

**Problème** 😱  

- **(E09)** La légende du copyright de l'illustration du lieu n'est pas reliée correctement à l’image qu’elle décrit car le bouton n'est pas focusable aux lecteurs d'écrans.

- **(E15)** La légende du copyright de l'affiche du film n'est pas reliée correctement à l’image qu’elle décrit.

**Correction** 💡  

- **(E09)** Ajout de la légende du copyright de l'illustration du lieu directement dans l'`accessibilityLabel` du bouton de l'image.

- **(E15)** Ajout de la légende du copyright de l'affiche du film directement dans l'`accessibilityLabel` du bouton de l'image.

**Retours audit** 🔥
Texte

</details>

<br>

<details>

<summary> 🟠 Critère 5.2 - iOS - Chaque composant d’interface est-il contrôlable par le clavier et tout dispositif de pointage ?</summary>

**RAAM** : [Critère 5.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-5-2)  
**Ticket** : [PC-37476](https://passculture.atlassian.net/browse/PC-37476)  
**PR** : [#8789](https://github.com/pass-culture/pass-culture-app-native/pull/8789)

**Problème** 😱  

- **(E01)** Les composants à bascule (switch) et le lien "Politique de gestion des cookies" ne sont pas accessible aux lecteurs d'écrans. 

- **(E03)** Les composants "https://passculture.app/accueil" et "support@passculture.app" ne sont pas atteignables aux lecteurs d'écrans.

- **(E04)** Les composants "https://passculture.app/accueil" et "support@passculture.app" ne sont pas atteignables aux lecteurs d'écrans.

- **(E05)** Le composant à bascule pour permettre l'orientation n'est pas utilisable au clavier ou avec un autre dispositif de pointage. 

- **(E08)** Le composant à bascule pour la géolocalisation n'est pas utilisable au clavier ou avec un autre dispositif de pointage. 

- **(E15)** Les composants de choix de séance ("9H00 10€" et "11h00 10€") doivent un seul et même bloc, actuellement ils sont composés de 3 éléments dont un vide et il n'y a pas de rôle.


**Correction** 💡  

- **(E01)** Utilisation du composant `LinkInsideText` qui est accessible pour lien "Politique de gestion des cookies" et ajout d'un accessibiltyLabel accessible pour les composants à bascule (switch). 

- **(E03)** Utilisation du composant `LinkInsideText` qui est accessible.

- **(E04)** Utilisation du composant `LinkInsideText` qui est accessible.

- **(E05)** Utilisation d'un nouveau `accessibiltyRole` et d'un `accessibilityLabel` pour rendre accessible le composant à bascule pour permettre l'orientation. 

- **(E08)** Utilisation d'un nouveau `accessibiltyRole` et d'un `accessibilityLabel` pour rendre accessible le composant à bascule pour la géolocalisation.

- **(E15)** Ajoute d'un `accessibilityLabel` plus complet pour les composants de choix de séance ("9H00 10€" et "11h00 10€") pour les rendre d'un seul et même bloc.



**Retours audit** 🔥
Texte

</details>

<br>

<details>

<summary> 🟠 Critère 7.1 - Dans chaque écran, l’information est-elle structurée par l’utilisation appropriée de titres ?</summary>

**RAAM** : [Critère 7.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-7-1)  
**Ticket** : [PC-38205](https://passculture.atlassian.net/browse/PC-38205)  
**PR** : [#8740](https://github.com/pass-culture/pass-culture-app-native/pull/8740)

**Problème** 😱

- **(E04)** Les sous titres ne sont pas identifié comme des titres mais simplement comme des textes, car n'utilisent pas `getHeadingAttrs()`.
- **(E09)** Le titre dans le header d'un lieu n'est pas identifié comme un titre mais simplement comme un texte, car n'utilise pas `getHeadingAttrs()`.
- **(E14)** Le titre "Rechercher" de la page de recherche n'est pas identifié comme un titre mais simplement comme un texte, car utilise `getHeadingAttrs()` mais sur une `View`.

**Correction** 💡

- **(E04)** Utilisation de `getHeadingAttrs(3)` pour les sous titres de type `Typo.BodyAccent`
- **(E09)** Utilisation de `getHeadingAttrs(3)` pour les sous titres de type `Typo.BodyAccent`
- **(E14)** Utilisation de `getHeadingAttrs(1)` sur le texte et non sur le container qui était une `View`

</details>

<br>

<details>

<summary> 🟠 Critère 7.2 - Dans chaque écran, chaque liste est-elle correctement structurée ?</summary>

**RAAM** : [Critère 7.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-7-2)  
**Ticket** : [PC-38209](https://passculture.atlassian.net/browse/PC-38209)  
**PR** : [#8778](https://github.com/pass-culture/pass-culture-app-native/pull/8778)

**Problème** 😱  

- **(E02)** Les options de recherche dans la modale "Localisation" ne sont pas structuré comme liste car les `accessibilityRole="list"` ou `accessibilityRole="listitem"` ne fonctionnent pas en natif. 

- **(E04)** Les éléments de listes des déclarations d'accessibilité ne sont pas structuré comme liste car les `accessibilityRole="list"` ou `accessibilityRole="listitem"` ne fonctionnent pas en natif. 

- **(E06)** Les éléments du plan du site ne sont pas structuré comme liste car les `accessibilityRole="list"` ou `accessibilityRole="listitem"` ne fonctionnent pas en natif. 

**Correction** 💡  
- **(E02 | E04 | E06)** Création d'un `accessiblityLabel="groupLabel – Liste - Élément X sur X - accessibilityLabel"` pour compenser le manque d'`accessibilityRole` `list` ou `listitem`.


**Retours audit** 🔥
Texte

</details>

<br>

<details>

<summary> 🟠 Critère 8.2 - Dans chaque écran, l’utilisateur peut-il augmenter la taille des caractères de 200% au moins ? - Part 1</summary>

**RAAM** : [Critère 8.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-2)  
**Ticket** : [PC-37484](https://passculture.atlassian.net/browse/PC-37484)  
**PR** : [#8730](https://github.com/pass-culture/pass-culture-app-native/pull/8730)

**Problème** 😱  
Certains éléments ne sont plus lisible lorsqu'il y a un zoom 200% :

- **(E01 / E03 / E04)** Des liens sont tronqué car le composant qui est utilisé pour les afficher n'est pas vrai un texte
- **(E06)** Les éléments dans le "plan du site" sont tronqué car ils n'utilisent pas de composant bouton.
- **(E09)** Les tags ont une hauteur limité, ce qui empeche un texte de s'afficher sur 2 ou 3 lignes.
- **(E12)** La page de statut de la demande de déblocage du crédit ne scroll pas, car on bloque sa hauteur.
- **(E15)** Les options dans le calendrir ont une hauteur et largeur limité, ce qui empeche un texte de s'afficher sur 2 lignes.

**Correction** 💡

- **(E01 / E03 / E04)** Pour les liens tronqué, nous avons utilisé le nouveau composant `LinkInsideText`
- **(E06)** Utilisation de boutons pour tous les éléments du plan du site, qui gère mieux le passage à la ligne et ne tronque pas le texte.
- **(E09)** Utilisation d'une `minHeight` plutôt que `height` pour permettre d'afficher le texte des tags sur plusieurs lignes.
- **(E12)** Utilisation de `flexGrow: 1` plutot que `flex: 1` dans la `ScrollView` pour permettre à la page de scroller.
- **(E15)** Utilisation d'une `minHeight` plutôt que `height` et d'une "minWidth`plutôt que`width` pour permettre d'afficher le texte des options sur plusieurs lignes.

</details>

<br>

<details>

<summary> 🟠 Critère 8.6 - Dans chaque écran, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?</summary>

**RAAM** : [Critère 8.6](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-X-X)  
**Ticket** : [PC-37486](https://passculture.atlassian.net/browse/PC-37486)  
**PR** : [#8753](https://github.com/pass-culture/pass-culture-app-native/pull/8753)

**Problème** 😱  

- **(E02)** Le bouton de menu actif dans la navigation en bas d'écran n'a pas de mention "actif/non actif" accessible aux lecteurs d'écrans.

- **(E08)** Le toggle de localisation n'a pas de mention "coché/non coché" accessible aux lecteurs d'écrans.

- **(E11)** Dans la liste des obligations pour la conception du mot de passe, les coches n'ont pas de mention "validé / invalidé" accessible aux lecteurs d'écrans. 

- **(E14)** Les tabs liste / grille n'ont pas d'indication de sélection accessible aux lecteurs d'écrans.

- **(E15)** Les indications "accessible / non accessible" du bloc d'accessibilité des offres et lieux ne sont pas accessibles aux lecteurs d'écrans.


**Correction** 💡  

- **(E02)** Ajout de la mention "actif/incactif" sur les boutons du menu de navigation via l'`accessibilityLabel`.

- **(E08)** Ajout de la mention "coché/non coché" sur tous les toggles via l'`accessibilityLabel`. 

- **(E11)** Ajout de la mention "validé/invalidé" sur les critères du mot de passe via l'`accessibilityLabel`. 

- **(E14)** Ajout de la mention "actif/incatif" sur les tabs de la recherche via l'`accessibilityLabel`.

- **(E15)** Ajout de la mention "accessible/inaccessible" sur les critères d'accessibilité via l'`accessibilityLabel`.

**Retours audit** 🔥
Texte

</details>

<br>

<details>

<summary> 🟠 Critère 9.3 - Chaque étiquette associée à un champ de formulaire est-elle pertinente?</summary>

**RAAM** : [Critère 9.3](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-9-3)  
**Ticket** : [PC-37490](https://passculture.atlassian.net/browse/PC-37490)  
**PR** : [#8733](https://github.com/pass-culture/pass-culture-app-native/pull/8733)

**Problème** 😱

- **(E015)** Le champ pour le choix de l'horaire dans la modale "Choix des Options>Horaire n'indique pas "VF" "VO" etc.

**Correction** 💡

- **(E015)** L'`accessibilityLabel` du composant de sélection de l'horaire (`HourChoice.tsx`) n'incluait pas la propriété `description` qui est pourtant montré à l'écran. Après l'inclusion de cette information dans L'`accessibilityLabel`, la restitution des lecteurs d'écran est fidèle à ce qui est présenté visuellement à l'utilisateur.

</details>

<br>

<details>

<summary> 🟠 Critère 9.6 - Dans chaque formulaire, les champs de même nature sont-ils identifiés, si nécessaire ?</summary>

**RAAM** : [Critère 9.6](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-9-6)  
**Ticket** : [PC-37492](https://passculture.atlassian.net/browse/PC-37492)  
**PR** : [#8735](https://github.com/pass-culture/pass-culture-app-native/pull/8735)

**Problème** 😱

- (E05) Les boutons radio du bloc « Thème » ne sont pas correctement perçus comme un groupe par les technologies d’assistance.
- (E11) Les boutons checkbox du bloc « CGU & Données » ne sont pas correctement perçus comme un groupe par les technologies d’assistance.
- (E12) Les boutons radio du bloc « Statut » ne sont pas correctement perçus comme un groupe par les technologies d’assistance.

**Correction** 💡

- (E05) Ajout dans l'accessibilityLabel des boutons radio du label du groupe « Thème ».
- (E11) Ajout dans l'accessibilityLabel des boutons checkbox du label du groupe « CGU & Données ».
- (E12) Ajout dans l'accessibilityLabel des boutons radio du label du groupe « Statut ».

</details>

<br>

## ✅ Corrections 31 octobre → 19 novembre

<br>

## ✅ Corrections 19 novembre → 15 décembre

<br>

## 💡 Questions


</details>

<br>

<details>

<summary> ⏳ Critère 1.1 - Android - Chaque élément graphique de décoration est-il ignoré par les technologies d’assistance ?</summary>

**RAAM** : [Critère 1.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-1-1)  
**Ticket** : [PC-37377](https://passculture.atlassian.net/browse/PC-37377)  
**PR** : [#XXXX](https://github.com/pass-culture/pass-culture-app-native/pull/XXXX)

**Problème** 😱  
Lorsque je démarre TalkBack sur la home, toute la home est restitué en Français.
Si je vais dans `HomeModule.tsx` et que je retire `BusinessModule` de l'array de modules, lorsque je démarre Talkback, cette fois-ci il ne restitura que "Bienvenue" et ça sera lu comme si c'était de l'anglais.
Dans tous les cas (si la home est restitué en entièrété en français, ou juste le titre es restitué), lorsque j'appuies manuellement sur un élément de la home, c'est restitué comme si c'était de l'anglais.

En ce qui concerne la restitution non-voulu des emojis contenus dans les titres des divers modules, pour constater ce problème, il faut que l'entièrété de la page soit restitué.

J'ai remarqué qu'il semble y avoir 2 modes de restitution par TalkBack:

- Une automatique qui se déclenche au démarrage de TalkBack quand on est sur la Home
- Une manuelle lorsqu'on appuies sur un élément

C'est dans le premier mode seulement que j'arrive à reproduire la lecture non-voulue des emojis.

Pourquoi la lecture automatique se déclenche seulement sur certaines écrans?

J'ai remarqué que c'était sur les écrans sans entête `headerShown: false` que tout la page est lu. Ou autre hypothèse: la liste de la home est un composant et est lu enitèrement et que le TalkBack ne lit que le premier élément lors de son activation. Peut être que le header prévient la lecture de la liste de la home.

Lors d'une lecture manuelle des éléments de la home, les emojis ne sont pas lus grâce au code existant dans `AccessibleTitle` ou le titre est séparé des emojis qu'il pourrait contenir, et le `accessibilityLabel` est défini à `titleText` (sans l'emoji).

Si je supprime ce `accessibilityLabel`, les emojis dans le titre sont lus, même en lecture manuelle, ce qui me permet de conclure que ce code fonctionne correctement.

**Correction** 💡  
En réalité, nous n'avions pas testé correctement le plan du site avec le TalkBack. En plus de la restitution de toute la page lors de l'activation du TalkBack, de la restitution en appuyant un élément, on peut utiliser le swipe pour "naviguer" à travers les éléments. En swipant, on arrive bien a reproduire le problème qu'avait constaté l'auditeur. On endend bien un "click" entre les éléments. Mais ce n'était pas la restitution du svg "point" comme le pensait l'auditeur.

Le son que nous entendions entre les éléments du plan du site était la restitution d'un texte vide. Ce texte vide était dû à la mauvaise utilisation d'un composant texte, utilisé comme conteneur, alors qu'il fallait utilisé une simple `View`. Une fois le composant texte remplacé par une `View`, nous n'avions plus le bruit parasite entre chaque element.
</details>

<br>

<details>

<summary> ⏳ Critère 9.12 - Pour chaque champ qui attend une donnée personnelle de l’utilisateur, la saisie est-elle facilitée ?</summary>

**RAAM** : [Critère 9.12](https://accessibilite.public.lu/fr/raam1/referentiel-technique.html#crit-9-12)  
**Ticket** : [PC-37497](https://passculture.atlassian.net/browse/PC-37497)  
**PR** : [#XXXX](https://github.com/pass-culture/pass-culture-app-native/pull/XXXX)

| iOS Version | TextInput Type | Contact Menu AutoFill | Direct Email Suggestion AutoFill | Typing Contact Name AutoFill |
| ----------- | -------------- | --------------------- | -------------------------------- | ---------------------------- |
| 16.4        | Multi-layer    | ❌ Doesn't work       | ❌ Doesn't work                  | ❌ Doesn't work              |
| 16.4        | Basic          | ❌ Doesn't work       | ✅ Works                         | ❌ Doesn't work              |
| 18.3.1      | Multi-layer    | ✅ Works              | ❌ Doesn't work                  | ✅ Works                     |
| 18.3.1      | Basic          | ✅ Works              | ❌ Doesn't work                  | ✅ Works                     |

Legend:
`TextInput` Type Basic = a generic `TextInput` imported directly from `react-native`, with accessibility props:

```ts
<TextInput
 style={{ backgroundColor: 'yellow', height: 40 }}
 textContentType="emailAddress"
 autoComplete="email"
/>
```

`TextInput` Type Multi-layer = our custom input component `EmailInputController`.

</details>

<br>

## 📂 Template

<details>

<summary> ⏳ Critère X.X - Texte</summary>

**RAAM** : [Critère X.X](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-X-X)  
**Ticket** : [PC-XXXXX](https://passculture.atlassian.net/browse/PC-XXXXX)  
**PR** : [#XXXX](https://github.com/pass-culture/pass-culture-app-native/pull/XXXX)

**Problème** 😱  
Texte

**Correction** 💡  
Texte

**Retours audit** 🔥
Texte

</details>
