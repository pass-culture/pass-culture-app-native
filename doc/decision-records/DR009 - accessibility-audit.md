# 🌈 Suivi des corrections d’accessibilité

| Plateforme | Conformité | 07 juillet | 26 septembre | 30 octobre | 19 novembre | 12 décembre |
| ---------- | ---------- | ---------- | ------------ | ---------- | ----------- | ----------- |
| Android    | RAAM 1.1   | 35.71%     | ⏳           | ⏳         | ⏳          | ⏳          |
|            | EN 301-549 | 35.42%     | ⏳           | ⏳         | ⏳          | ⏳          |
| iOS        | RAAM 1.1   | 28.57%     | ⏳           | ⏳         | ⏳          | ⏳          |
|            | EN 301-549 | 20.83%     | ⏳           | ⏳         | ⏳          | ⏳          |

<br>

## 📋 Légende

⏳ : En cours de développement  
🟠 : Correction disponible à la vérification  
🟢 : Correction validée  
🔴 : Correction invalidée

<br>

## ✅ Corrections 26 août → 26 septembre

<details>

<summary> 🟠 Critère 2.3 - Dans chaque écran, les couleurs utilisées dans les composants d’interface et les éléments graphiques porteurs d’informations sont-elles suffisamment contrastées ?</summary>

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

<summary> 🟠 Critère 7.1 - b) Dans chaque écran, l’information est-elle structurée par l’utilisation appropriée de titres ?</summary>

**RAAM** : [Critère 7.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-7-1)  
**Ticket** : [PC-37481](https://passculture.atlassian.net/browse/PC-37481)  
**PR** : [#8561](https://github.com/pass-culture/pass-culture-app-native/pull/8561)

**Problème** 😱  
Les titres n’avaient pas de rôle car nous avons ajouté `AccessibilityRole.HEADING` uniquement en web. De plus, ce rôle n’a aucune correspondance en native.

**Correction** 💡  
Utilisation de `AccessibilityRole.HEADER` dans `getHeadingAttrs()` qui permet d’ajouter le rôle dans tous les titres de manière automatique.

</details>

<br>

<details>

<summary> 🟠 Critère 7.2 - iOS - Dans chaque écran, chaque liste est-elle correctement structurée ?</summary>

**RAAM** : [Critère 7.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-7-2)  
**Ticket** : [PC-37482](https://passculture.atlassian.net/browse/PC-37482)  
**PR** : [#8607](https://github.com/pass-culture/pass-culture-app-native/pull/8607)

**Problème** 😱  
Certaines listes n’étaient pas identifiées comme des listes `<ul>` et `<li>`.

**Correction** 💡  
Utilisation des composants `Li` associés à des `AccessibilityRole.LIST`.

</details>

<br>

<details>

<summary> 🟠 Critère 8.1 - Dans chaque écran, le contenu visible porteur d’information est-il accessible aux technologies d’assistance ? - Partie 1</summary>

**RAAM** : [Critère 8.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-8-1)  
**Ticket** : [PC-37483](https://passculture.atlassian.net/browse/PC-37483)  
**PR** : [#8579](https://github.com/pass-culture/pass-culture-app-native/pull/8579)

**Problème** 😱  
Certains textes n’étaient pas vocalisés car ils n’étaient pas inclus dans les labels.

**Correction** 💡  
Ajout d’informations dans certains `accessibilityLabel` et/ou suppression d’`accessibilityLabel` inutiles afin d’éviter toute confusion.

</details>

<br>

<details>

<summary> 🟠 Critère 8.5 - iOS - Dans chaque écran, pour chaque élément recevant le focus, la prise de focus est-elle visible ?</summary>

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
<summary> 🟠 Critère 9.5 - b) Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent ?</summary>

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

## ✅ Corrections 26 septembre → 30 octobre

<br>

## ✅ Corrections 30 octobre → 19 novembre

<br>

## ✅ Corrections 19 novembre → 12 décembre

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

</details>
