# 🌈 Suivi des corrections d’accessibilité

| Plateforme | Conformité | 07 juillet 2025 | 26 septembre 2025 | 31 octobre 2025 | 28 novembre 2025 | 2 février 2026 |
| ---------- | ---------- | --------------- | ----------------- | --------------- | ---------------- | -------------- |
| Android    | RAAM 1.1   | 35.71%          | 44.19%            | 62.79%          | 72.09%           | 76.74%         |
|            | EN 301-549 | 35.42%          | 37.50%            | 41.67%          | 54.17%           | 56.25%         |
| iOS        | RAAM 1.1   | 28.57%          | 41.86%            | 58.14%          | 72.09%           | 76.74%         |
|            | EN 301-549 | 20.83%          | 25.00%            | 29.17%          | 54.17%           | 56.25%         |

<br>

## 📱 Échantillon

### Écrans

**E01** : Cookies  
**E02** : Accueil (et localisation)  
**E03** : Mention légales  
**E04** : Accessibilité  
**E05** : préférences d'affichages  
**E06** : Plan du site  
**E07** : Authentification  
**E08** : Profil connecté et déconnectéokies  
**E09** : Lieu

### Parcours

**E10** : Onboarding  
**E11** : Processus d’inscription  
**E13** : Processus de déblocage du crédit (Identification)  
**E14** : Recherche d’une offre  
**E15** : Réservation d’une offre  
**E16** : Réservation d’une offre (détails avant et après confirmation)

<br>

## 📋 Légende

🟠 : Correction disponible à la vérification  
🟢 : Correction validée  
🔴 : Correction invalidée  
⏳ : Questions en attente de réponse

<br>

## ✅ Corrections 26 août 2025 → 26 septembre 2025

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

## ✅ Corrections 26 septembre 2025 → 31 octobre 2025

<details>

<summary> 🟢🟢 Critère 1.1 - Android - Chaque élément graphique de décoration est-il ignoré par les technologies d’assistance ?</summary>

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

<summary> 🟢🟢 Critère 1.9 - Chaque élément graphique légendé est-il correctement restitué par les technologies d’assistance ?</summary>

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

<summary> 🔴🔴 Critère 5.2 - iOS - Chaque composant d’interface est-il contrôlable par le clavier et tout dispositif de pointage ?</summary>

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

<summary> 🟢🟢 Critère 7.1 - Dans chaque écran, l’information est-elle structurée par l’utilisation appropriée de titres ?</summary>

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

<summary> 🔴🔴 Critère 7.2 - Dans chaque écran, chaque liste est-elle correctement structurée ?</summary>

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

<summary> 🔴🔴 Critère 8.2 - Dans chaque écran, l’utilisateur peut-il augmenter la taille des caractères de 200% au moins ? - Part 1</summary>

**RAAM** : [Critère 8.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-2)  
**Ticket** : [PC-37484](https://passculture.atlassian.net/browse/PC-37484)  
**PR** : [#8730](https://github.com/pass-culture/pass-culture-app-native/pull/8730)

**Problème** 😱  
Certains éléments ne sont plus lisible lorsqu'il y a un zoom 200% :

- **(E01 / E03 / E04)** Des liens sont tronqué car le composant qui est utilisé pour les afficher n'est pas vrai un texte
- **(E06)** Les éléments dans le "plan du site" sont tronqué car ils n'utilisent pas de composant bouton.
- **(E09)** Les tags ont une hauteur limité, ce qui empeche un texte de s'afficher sur 2 ou 3 lignes.
- **(E12)** La page de statut de la demande de déblocage du crédit ne scroll pas, car on bloque sa hauteur.
- **(E15)** Les options dans le calendrier ont une hauteur et largeur limité, ce qui empeche un texte de s'afficher sur 2 lignes. De plus, lorsque le bouton "Voir plus" est activé, il devient impossible de faire défiler l’écran jusqu'en bas.

**Correction** 💡

- **(E01 / E03 / E04)** Pour les liens tronqué, nous avons utilisé le nouveau composant `LinkInsideText`
- **(E06)** Utilisation de boutons pour tous les éléments du plan du site, qui gère mieux le passage à la ligne et ne tronque pas le texte.
- **(E09)** Utilisation d'une `minHeight` plutôt que `height` pour permettre d'afficher le texte des tags sur plusieurs lignes.
- **(E12)** Utilisation de `flexGrow: 1` plutot que `flex: 1` dans la `ScrollView` pour permettre à la page de scroller.
- **(E15)** Utilisation d'une `minHeight` plutôt que `height` et d'une "minWidth`plutôt que `width` pour permettre d'afficher le texte des options sur plusieurs lignes. Pour le bas de l'écran, suppression d'un ScrollView suprerficielle.

</details>

<br>

<details>

<summary> 🟢🟢 Critère 8.6 - Dans chaque écran, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?</summary>

**RAAM** : [Critère 8.6](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-6)  
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

<summary> 🟢🟢 Critère 9.2 - Chaque champ de formulaire a-t-il une étiquette accessible aux technologies d’assistance ?</summary>

**RAAM** : [Critère 9.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-9-2)  
**Ticket** : [PC-37489](https://passculture.atlassian.net/browse/PC-37489)  
**PR** : [#8814](https://github.com/pass-culture/pass-culture-app-native/pull/8814)

**Problème** 😱

- **(E01 | E07 | E11 | E12 | E14)** Les champs de formulaire suivant ne possèdent pas d'étiquette correctement liée et ne sont pas accessible lorsqu’on navigue avec un lecteur d'écran :

  - "Ville, code postal, adresse"
  - "Adresse e-mail"
  - "Indique ton code postal et choisis ta ville"
  - "Prix minimum (en €)"
  - "Prix maximum (en €)"

- **(E05 | E08 | E14)** Les composants à bascule (switch) ne possèdent pas d'étiquette correctement liée et ne sont pas accessible lorsqu’on navigue avec un lecteur d'écran :
  - "Tout accepter"
  - "Personnaliser ta navigation"
  - "Enregistrer des statistiques de navigation"
  - "Mesurer l’efficacité de nos publicités"
  - "Lire les contenus vidéos"
  - "Permettre l'orientation"
  - "Activer ma géolocalisation"
  - "Uniquement les offres gratuites"

**Correction** 💡

- **(E01 | E07 | E11 | E12 | E14)** Ajout du label et informations complémentaires de l'input directement dans l'`accessibilityLabel` :

  - "Ville, code postal, adresse"
  - "Adresse e-mail"
  - "Indique ton code postal et choisis ta ville"
  - "Prix minimum (en €)"
  - "Prix maximum (en €)"

- **(E05 | E08 | E14)** Ajout du label et informations complémentaires des composants à bascule (switch) directement dans l'`accessibilityLabel` :
  - "Tout accepter"
  - "Personnaliser ta navigation"
  - "Enregistrer des statistiques de navigation"
  - "Mesurer l’efficacité de nos publicités"
  - "Lire les contenus vidéos"
  - "Permettre l'orientation"
  - "Activer ma géolocalisation"
  - "Uniquement les offres gratuites"

**Retours audit** 🔥
Texte

</details>

<br>

<details>

<summary> 🟢🟢 Critère 9.3 - Chaque étiquette associée à un champ de formulaire est-elle pertinente?</summary>

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

<summary> 🟢🟢 Critère 9.6 - Dans chaque formulaire, les champs de même nature sont-ils identifiés, si nécessaire ?</summary>

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

<details>

<summary> 🟢🟢 Critère 9.8 - Pour chaque champ de formulaire qui attend un type de données et/ou un format spécifique, l’information correspondante est-elle disponible ?</summary>

**RAAM** : [Critère 9.8](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-9-8)  
**Ticket** : [PC-37493](https://passculture.atlassian.net/browse/PC-37493)  
**PR** : [#8786](https://github.com/pass-culture/pass-culture-app-native/pull/8786)

**Problème** 😱

- **(E09)** Pour le champ "Adresse e-mail" le format attendu est présent mais n'est pas lié à l'étiquette.

- **(E11)** Pour les champs "Adresse e-mail" et le "Mot de passe", le format attendu est présent mais n'est pas lié à l'étiquette.

**Correction** 💡

- **(E09 | E11)** Utilisation d'un accessibiltyLabel avec toutes les informations (label, format, obligation) ajouté directement dans l'input et les textes visibles par les utilisateurs sont ignorés aux lecteurs d'écrans pour éviter les doublons.

**Retours audit** 🔥

Texte

</details>

<br>

<details>

<summary> 🔴🔴 Critère 11.9 - Dans chaque écran, le contenu proposé est-il consultable quelle que soit l’orientation de l’écran (portrait ou paysage) ?</summary>

**RAAM** : [Critère 11.9](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-11-9)  
**Ticket** : [PC-37501](https://passculture.atlassian.net/browse/PC-37501)  
**PR** : [#8795](https://github.com/pass-culture/pass-culture-app-native/pull/8795), [#8812](https://github.com/pass-culture/pass-culture-app-native/pull/8812)

**Problème** 😱

- **(E01)** L'orientation en mode paysage est bloqué par défaut sur l'application. Pour la débloquer il faut se rendre dans la section "Préférences d‘affichage" qui est difficilement accessible lors de la consultation de l’application la première fois (car l'onboarding ajoute plusieurs étapes).

- **(E02)** Des contenus disparaissent (tronqués) lors de la consultation en mode paysage.

- **(E14)** En mode paysage, la liste des résultats est très peu visible.

**Correction** 💡

- **(E01)** Déblocage de l’orientation en mode paysage par défaut, pour prendre en compte les paramètres du téléphone.

- **(E02 | E14)** Ajout de bordures horizontales en mode paysage pour éviter que des éléments soient tronqués ou cachés.

**Retours audit** 🔥
Texte

</details>

<br>

## ✅ Corrections 31 octobre 2025 → 28 novembre 2025

<br>

<details>

<summary> 🟢🟢 Critère 3.11 - Pour chaque média temporel pré-enregistré, le contenu textuel adjacent permet-il d’identifier clairement le média temporel ?</summary>

**RAAM** : [Critère 3.11](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-3-11)  
**Ticket** : [PC-37472](https://passculture.atlassian.net/browse/PC-37472)  
**PR** : [#8863](https://github.com/pass-culture/pass-culture-app-native/pull/8863)

**Problème** 😱

- **(E02)** Les vidéos ne sont pas clairement identifiables.

**Correction** 💡

- **(E02)** Une description de la vidéo a été ajoutée entre le titre et la vidéo.
- **(E02)** Le label d'accessibilité du titre de la vidéo précise qu'il s'agit d'un média vidéo.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🟢🟢 Critère 5.1 - c) Chaque composant d’interface est-il, si nécessaire, compatible avec les technologies d’assistance ?</summary>

**RAAM** : [Critère 5.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-5-1)  
**Ticket** : [PC-37475](https://passculture.atlassian.net/browse/PC-37475)  
**PR** : [#8889](https://github.com/pass-culture/pass-culture-app-native/pull/8889)

**Problème** 😱

- **(E02)** Le bouton qui permet d'ouvrir la modale de localisation ne reprend pas dans le nom accessible le nom de la localisation (quand cette dernière est renseignée).
- **(E03)** Le lien "support@passculture.app" a pour nom accessible "ouvrir le gestionnaire mail pour contacter le support".
- **(E04)** Non-conformité de typologie similaire à celle décrite sur l'écran "E03". Présente également ici, mais non redétaillée..
- **(E11)** Le composant de sélection de la date (vocalise des données incohérentes "1900" etc.).
- **(E14)** Les offres de chaque section ont un nom accessible qui ne reprend pas l'intégralité du contenu visible (il manque parfois l'information sur le nombre de "J'aime", et également parfois le lieu comme par exemple dans la section "Les librairies et bibliothèques").

**Correction** 💡

- **(E02)** Reprise du nom visible au début de l'accessibilityLabel du bouton qui permet d'ouvrir la modale de localisation.
- **(E03 | E04 )** Reprise du nom visible au début de l'accessibilityLabel des boutons "support@passculture.app".
- **(E11)** Le composant de sélection de la date vocalise les données qui sont séléctionnée depuis une mise à jour de la librairie utilisé pour créer le date picker.
- **(E14)** Ajoute de tous les éléments présents visuellement directement dans l'accessibilityLabel des offres.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🟢🟢 Critère 5.2 - Chaque composant d’interface est-il contrôlable par le clavier et tout dispositif de pointage ?</summary>

**RAAM** : [Critère 5.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-5-2)  
**Ticket** : [PC-38647](https://passculture.atlassian.net/browse/PC-38647)  
**PR** : [#8878](https://github.com/pass-culture/pass-culture-app-native/pull/8878)

**Problème** 😱

- **(E01)** Les liens sont bien contrôlable par le calvier ou tout dispositif de pointage, mais l'intitulé ne semble pas bon, à la suite du lien dit : "Link one of one" ou "One link found, swipe to move to the link".

**Correction** 💡

- **(E01)** Le problème de “One … found, swipe to move to the …” est impossible résoudre de notre côté car c’est un comportement natif d’iOS / VoiceOver qui ne prend pas en compte le français pour les hint

  1. **La lecture “One link found…” vient du moteur VoiceOver d’iOS, pas du code JavaScript ni de React Native (dans notre cas au pass Culture).**  
     Quand VoiceOver détecte un élément accessible (accessibilityRole="link", button, etc.), il envoie directement les messages système depuis UIKit (le moteur natif d’Apple).
     React Native ne fait ici que déclarer des attributs d’accessibilité via ses props (accessibilityRole, accessibilityLabel, etc.).
     Ensuite, c’est iOS qui décide quoi lire et dans quelle langue. Donc ce message ne passe même pas par la couche JavaScript.

  2. **React Native transmet simplement les propriétés d’accessibilité natives**  
     Quand on écris : <Text accessibilityRole="link" accessibilityLabel="Politique de cookies" />
     React Native fait juste une passerelle vers : "UIAccessibilityTraitsLink accessibilityLabel = @"Politique de cookies"", dans le moteur natif d’iOS.
     Aucune traduction, aucun hint automatique ne vient de React Native, tout est géré par Apple via UIAccessibility.

  3. **Pourquoi on entend encore l’anglais ?**  
     Ce n’est donc pas une erreur de React Native, mais une incohérence interne à iOS car les voix françaises utilisent encore des hints anglais, par manque de traduction.
     J'ai essayé les différentes voix françaises en normal et premium et j'ai toujours le même résultat.
     C’est le même comportement qu’on retrouve dans Swift, SwiftUI ou UIKit si on fait une application iOS pure, on aura exactement la même phrase en anglais dans ces conditions.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🟢🟢 Critère 6.1 - iOS - Dans chaque écran, les textes sont-ils restitués par les technologies d’assistance dans la langue principale de l’écran ?</summary>

**RAAM** : [Critère 6.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-6-1)  
**Ticket** : [PC-37479](https://passculture.atlassian.net/browse/PC-37479)  
**PR** : [#8883](https://github.com/pass-culture/pass-culture-app-native/pull/8883)

**Problème** 😱

- **(E05 | E14 | E16)** L'état des boutons radio (checked/unchecked) ne sont pas restitués par le lecteur d'écran dans la langue de traitement principale.

- **(E09 | E11 | E13)** Non-conformité de typologie similaire à celle décrite sur l'écran "E05". Présente également ici, mais non redétaillée. (concerne les composants qui ouvrent et ferment du contenu (bloc "Accessibilité" de l'onglet "Infos pratiques" ) -> vocalise collapsed/extended)

**Correction** 💡

- **(E05 | E09 | E11 | E13 | E14 | E16)** Comme pour le critère 5.2, le problème de la lecteur des aides à la compréhension de l'interface en anglais est impossible résoudre de notre côté car c’est un comportement natif d’iOS / VoiceOver qui ne prend pas en compte le français pour les hint.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🟢🟢 Critère 7.2 - Dans chaque écran, chaque liste est-elle correctement structurée ?</summary>

**RAAM** : [Critère 7.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-7-2)  
**Ticket** : [PC-38648](https://passculture.atlassian.net/browse/PC-38648)  
**PR** : [#8905](https://github.com/pass-culture/pass-culture-app-native/pull/8905)

**Problème** 😱  
La liste du bloc "Profil" indique "sur 12" en non connecté, alors qu'il y a 9 éléments.

**Correction** 💡  
Le nombre d'élément de la liste est bien calculée en fonction de la connexion ou non connexion de l'utilisateur.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🔴🔴 Critère 8.2 - Dans chaque écran, l’utilisateur peut-il augmenter la taille des caractères de 200% au moins ? - Part 2</summary>

**RAAM** : [Critère 8.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-2)  
**Ticket** : [PC-38162](https://passculture.atlassian.net/browse/PC-38162), [PC-38367](https://passculture.atlassian.net/browse/PC-38367)  
**PR** : [#8850](https://github.com/pass-culture/pass-culture-app-native/pull/8850), [#8866](https://github.com/pass-culture/pass-culture-app-native/pull/8866)

**Problème** 😱

- **(E09)** Les playlists de lieu dans la recherche thématique sont tronqué lors d'un zoom 200% car la hauteur est limité.

- **(E14)** Dans la calendrier les dates sont illisible (Lun. > L…) car la largeur utilisé pour le composant des dates possède une largeur maximum.

**Correction** 💡

- **(E09)** Suppression de la taille fix pour les playlists de lieu dans la recherche thématique qui permet à la playlist de prendre toute la hauteur.

- **(E14)** Suppression de la taille maximale dans le composant des dates du calendrier (Lun. > L…), ce qui permet au texte de prendre la place nécessaire.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🟢🟢 Critère 9.1 - Chaque champ de formulaire a-t-il une étiquette visible ?</summary>

**RAAM** : [Critère 9.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-9-1)  
**Ticket** : [PC-38816](https://passculture.atlassian.net/browse/PC-38816)  
**PR** : [#8903](https://github.com/pass-culture/pass-culture-app-native/pull/8903)

**Problème** 😱

- **(E14)** Le champ "Offre, artiste, lieu culturel..." est un placeholder et disparait donc au premier caractère saisit.

**Correction** 💡

- **(E14)** Implémentation d'un nouveau SearchInput en lien avec le design-system qui intègre directement un label au-dessus qui ne disparaît pas lors de la saisie.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🟢🟢 Critère 9.9 - Dans chaque formulaire, les erreurs de saisie sont-elles accessibles ?</summary>

**RAAM** : [Critère 9.9](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-9-9)  
**Ticket** : [PC-37494](https://passculture.atlassian.net/browse/PC-37494)  
**PR** : [#8882](https://github.com/pass-culture/pass-culture-app-native/pull/8882)

**Problème** 😱

- **(E07)** Les messages d'erreurs suivant ne sont pas restitués par le lecteur d'écran à la prise de focus sur le champ :

  - Le message d'erreur du champ "Adresse e-mail".
  - Le message d'erreur "E-mail ou mot de passe incorrect".

- **(E11)** Le message d'erreur suivant n'est restitué par le lecteur d'écran à la prise de focus sur le champ : Le message d'erreur du champ "Adresse e-mail".

- **(E12)** Le message d'erreur de l'ensemble des champs du parcours (ex. lorsque l'utilisateur saisit un chiffre dans le champ "Prénom", le message "Ton prénom ne doit pas contenir de chiffres ou de caractères spéciaux.")

**Correction** 💡

- **(E07 | E11 | E12)** Pour l'ensemble des champs de texte ou de recherche, nous avons ajouté le message d'erreur directement dans l'`accessibilityLabel`, ce qui à la prise de focus, permet d'avoir le message d'erreur (en plus de toutes les autres informations nécessaires à la compréhension du champ).

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🔴🔴 Critère 9.11 - Pour chaque formulaire qui modifie ou supprime des données [...] les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur ?</summary>

**RAAM** : [Critère 9.11](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-9-11)  
**Tickets** : [PC-37495](https://passculture.atlassian.net/browse/PC-37495)
**PR** : [#8911](https://github.com/pass-culture/pass-culture-app-native/pull/8911)

**Problème** 😱

- **(E12)** Le formulaire transmet des données sensibles sur l'utilisateur, mais elles ne peuvent pas être modifiées, mises à jour ou récupérées par l'utilisateur.

**Correction** 💡

- **(E12)** Ajout d'une étape de vérification des données ajouté par l'utilisateur juste avant d'enregistrer les données dans le backend. De plus, l'utilisateur à la possiblité de modifier ces données s'il s'est trompé.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🔴🔴 Critère 11.9 - Dans chaque écran, le contenu proposé est-il consultable quelle que soit l’orientation de l’écran (portrait ou paysage) ? </summary>

**RAAM** : [Critère 11.9](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-11-9)  
**Ticket** : [PC-38650](https://passculture.atlassian.net/browse/PC-38650) & [PC-38849](https://passculture.atlassian.net/browse/PC-38849)
**PR** : [#8919](https://github.com/pass-culture/pass-culture-app-native/pull/8919) & [#8948](https://github.com/pass-culture/pass-culture-app-native/pull/8948)

**Problème** 😱

- **(E01)(E02)(E09)(E14)(E16)** En format paysage, du contenu textuel ou interactif est coupé par le nootch.
- **(E10)(E14)(E16)** En format paysage, le contenu n'est pas entièrement visible car pas ou pas assez défilable.
- **(E14)** En format paysage, les boutons des recherches thématiques peuvent être coupées.

**Correction** 💡

- Ajout de marges dynamiques (dépendant de la taille du nootch de chaque appareil) en format paysage pour voir l'ensemble du contenu:

  - **(E01)** modal cookies
  - **(E02)** accueil (la visibilité partielles des prochaines cartes dans ces playlists est voulue pour inciter au scroll horizontal)
  - **(E09)** page lieu, onglets Offres disponibles et Infos pratiques
  - **(E14)** modales filtres de recerches : accessibilité et lieu culturel
  - **(E14)** liste des résultats : en mode paysage, la liste est très peu visible
  - **(E16)** modales de réservation - options : prix et horaires

- Page défilable pour accéder à l'ensemble du contenu en format paysage:

  - **(E10)** page pass pour tous (19 ou +)
  - **(E14)** résultats de recherche : pas de résultat
  - **(E14)** liste des résultats : suppression des filtres pour laisser plus de place à la liste
  - **(E16)** mes réservations : pas de réservation

- **(E14)** Les boutons des recherches sont défilables horizontalement en format paysage

**Retours audit** 🔥  
Texte

</details>

<br>

## ✅ Corrections 28 novembre 2025 → 02 février 2026

<br>

<details>

<summary> 🔴🔴 Critère 5.1 - a) Chaque composant d’interface est-il, si nécessaire, compatible avec les technologies d’assistance ?</summary>

**RAAM** : [Critère 5.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-5-1)  
**Ticket** : [PC-37473](https://passculture.atlassian.net/browse/PC-37473)  
**PR** : [#8945](https://github.com/pass-culture/pass-culture-app-native/pull/8945)

**Problème** 😱  
De très nombreux composants répartis sur l’ensemble des écrans de l’application sont exposés avec le rôle de lien, alors qu’ils permettent de naviguer dans l’application (vers d’autres vues internes). Et inversement. Il y a également des boutons ou liens qui ne possèdent même pas de rôle.

**Correction** 💡  
Nous avons ajouter la gestion des rôles bouton et lien de manière automatique sur nos composants, par exemple en mobile, `InternalTouchableLink` retourne un bouton et `ExternalTouchableLink` un lien.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🔴🔴 Critère 8.2 - Dans chaque écran, l’utilisateur peut-il augmenter la taille des caractères de 200% au moins ?</summary>

**RAAM** : [Critère 8.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-2)  
**Ticket** : [PC-38649](https://passculture.atlassian.net/browse/PC-38649)  
**PR** : [#9040](https://github.com/pass-culture/pass-culture-app-native/pull/9040)

**Problème** 😱

- **(Tous les écrans)** Certains textes sont tronqués car on limite le nombre de ligne (via `numberOfLines`)

**Correction** 💡

- **(Tous les écrans)** Adaptation du nombre de lignes des textes (`numberOfLines`) en fonction du zoom que l'utilisateur a défini dans ses paramètres.

</details>

<br>
<details>

<summary> 🟢🟢 Critère 9.12 -Pour chaque champ qui attend une donnée personnelle de l’utilisateur, la saisie est-elle facilitée ?</summary>

**RAAM** : [Critère 8.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-2)  
**Ticket** : [PC-37497](https://passculture.atlassian.net/browse/PC-37497)  
**PR** : [#9102](https://github.com/pass-culture/pass-culture-app-native/pull/9102)

**Problème** 😱

- **(Tous les écrans)** Pour au moins un champ qui attend une donnée personnelle de l'utilisateur, la nature de la saisie n'est pas identifiée correctement.

**Correction** 💡

- **E07, E11, E12** Ajout de la propriété autocomplete et suppression de la propriété textContentType qui entrait en concurrence.

</details>
<br>

<details>

<summary> 🟢🟢 Critère 10.1 - Dans chaque écran, l’ordre de tabulation au clavier est-il cohérent ?</summary>

**RAAM** : [Critère 10.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-10-1)  
**Ticket** : [PC-37499](https://passculture.atlassian.net/browse/PC-37499)& [PC-PC-39448)](https://passculture.atlassian.net/browse/PC-PC-39448)
**PR** : [#9045](https://github.com/pass-culture/pass-culture-app-native/pull/9045) & [#9085](https://github.com/pass-culture/pass-culture-app-native/pull/9085)

**Problème** 😱

- **(Tous les écrans)** Plusieurs composants interactifs ne sont pas correctement exposés aux technologies d’assistance, ce qui empêche leur accès au clavier ou via un lecteur d’écran (rôle manquant ou inapproprié).
- Lors de la soumission d'un formulaire, lorsqu’une ou plusieurs erreurs sont détectées le focus doit être placé sur le premier champ en erreur.

**Correction** 💡

- **(Tous les écrans)** Les composants interactifs sont maintenant correctement exposés aux technologies d’assistance grâce à l'ajout de rôle et labels accessibles, ce qui permet leur accès au clavier ou via un lecteur d’écran.
- pour les champs uniques, focus à l'erreur. Dans le cas de l'inscription, pour des raisons de sécurité, le message d'erreur est général, le focus est donc toujours sur le mail.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🔴🔴 Critère 10.2 - Dans chaque écran, l’ordre de restitution par les technologies d’assistance est-il cohérent ?</summary>

**RAAM** : [Critère 10.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-10-2)  
**Ticket** : [PC-37500](https://passculture.atlassian.net/browse/PC-37500)  
**PR** : [#9050](https://github.com/pass-culture/pass-culture-app-native/pull/9050)

**Problème** 😱

- **(E02)** Avec TalkBack, le balayage (swipe) ne permet pas d’atteindre certains éléments hors écran. ex. Lorsque l’on effectue un balayage avec TalkBack, l’écran ne défile pas automatiquement pour révéler les éléments suivants. Résultat : certains contenus ne sont jamais atteints par la navigation gestuelle.
- **(E09|E15)** L'accès aux textes "Les films à l'affiche" et "Les autres offres" ne suit pas un ordre logique. Le lecteur d'écran devrait accéder à la première section puis ensuite la seconde. Le bouton de retour à l'écran précédent et le bouton de partage (en haut de l'écran) sont atteints en fin de parcours.
- **(E11)** L'accès au texte "Lors de ton utilisation [...] newsletter." ne suit pas un ordre logique. Le lecteur d'écran devrait accéder au texte puis ensuite au bouton "S'inscrire".
- **(E12)** Entre chaque étape, le focus est directement sur le champ, plutôt que sur le premier élément de la page, cela oblige à un retour manuel vers le haut de la page.
- **(E14)** Les composants « Catégories » affichés sur deux lignes ne sont pas tous atteignables avec la navigation par balayage (swipe) : certains éléments sont sautés si l’utilisateur ne les explore pas manuellement à l’écran.

**Correction** 💡

- **(E02|E09|E14|E15)** Utilisation d'`accessibilityRole` pour rendre accessible des éléments qui ne l'étaient pas.
- **(E11)** Ajout du texte "Lors de ton utilisation [...] newsletter." dans le `accessibilityHint` du bouton "S'inscrire" pour qu'il soit lu en même temps.
- **(E12)** Suppression du `autoFocus` automatique sur les champs qui obligait à un retour manuel vers le haut de la page.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🔴🔴 Critère 11.9 - Dans chaque écran, le contenu proposé est-il consultable quelle que soit l’orientation de l’écran (portrait ou paysage) ? </summary>

**RAAM** : [Critère 11.9](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-11-9)  
**Ticket** : [PC-38765](https://passculture.atlassian.net/browse/PC-38765) & [PC-39267](https://passculture.atlassian.net/browse/PC-39267)
**PR** : [#8994](https://github.com/pass-culture/pass-culture-app-native/pull/8994) & [#8999](https://github.com/pass-culture/pass-culture-app-native/pull/8999)

**Problème** 😱

- **(E02)** En format paysage, le dernier bloc est bien atteint et visible, mais il faut maintenir le défilement pour en consulter le contenu. Dès que l’on relâche, une partie des contenus se retrouve à nouveau masquée.
- **(E09)** Aussi bien en mode portrait qu’en mode paysage, le bouton “Accéder aux séances” est positionné au-dessus des composants du bloc “Passe le bon plan”.
- **(E11)** Passer du mode portrait au mode paysage (ou inversement) pendant l’inscription provoque un retour à la première étape du processus.
- **(E14)** En format paysage, le bouton “Accéder aux séances” est positionné au-dessus des composants du bloc "ça peut aussi te plaire".

**Correction** 💡

- **(E02)(E09)(E14)** Ajout des marges nécessaires pour que tout le contenu soit visible.
- **(E11)** L'étape de l'inscription est correctement stocké et tourner l'appareil ne cause plus de retour à la première étape.

</details>

<br>

## ✅ Corrections 02 février 2026 → xxx

<br>

<details>

<summary> 🟠 Critère 3.7 - Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés ?</summary>

**RAAM** : [Critère 3.7](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-3-7)  
**Ticket** : [PC-37469](https://passculture.atlassian.net/browse/PC-37469)

**Problème** 😱  
E02 : La vidéo du bloc "Lujipeka répond à vos questions sur la tournée[...]" n'a pas de sous-titres synchronisés
E15 : Non-conformité de typologie similaire à celle décrite sur l'écran "E02". Présente également ici, mais non redétaillée.

**Correction** 💡  
E02 : Ajout de la vidéo de l'interview Orelsan et Clara Choï qui a des sous-titres syncronisées. Les sous-titres sont fait manuellement et non générés par IA.
E15 : Ce sont des vidéos qui seront ajoutées par les partenaires culturels

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🟠 Critère 3.8 - Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ceux-ci sont-ils pertinents ?</summary>

**RAAM** : [Critère 3.8](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-3-8)  
**Ticket** : [37470](https://passculture.atlassian.net/browse/PC-37470)

**Problème** 😱  
E02 : Les sous-titres de la vidéo du bloc "Le festival de rock" ne sont pas pertinents. Il faut compléter les sous-titres et les corriger avec les informations sonores manquantes présentes dans la vidéo.

**Correction** 💡  
E02 : Ajout de la vidéo de l'interview Orelsan et Clara Choï qui a des sous-titres pertinents. Les sous-titres sont fait manuellement et non générés par IA.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> 🟠Critère 8.2 - Dans chaque écran, l’utilisateur peut-il augmenter la taille des caractères de 200% au moins ? </summary>

**RAAM** : [Critère 8.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-2)  
**Ticket** : [40212](https://passculture.atlassian.net/browse/PC-40212)
**PR** : [#9230](https://github.com/pass-culture/pass-culture-app-native/pull/9230)

**Problème** 😱  
E07 : le texte "Obligatoire" du champ "Adresse e-mail" se retrouve partiellement hors écran

**Correction** 💡  
La mention obligaoire passe à la ligne lorsque lors d'un zoom egal ou supérieur à 200

**Retours audit** 🔥  
Texte

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
