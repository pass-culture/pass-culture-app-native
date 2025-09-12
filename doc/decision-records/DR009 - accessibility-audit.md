# 🌈 Suivi des corrections d’accessibilité

| Plateforme | Conformité | 07 juillet | 26 septembre | 30 octobre | 19 novembre | 12 décembre |
| ---------- | ---------- | ---------- | ------------ | ---------- | ----------- | ----------- |
| Android    | RAAM 1.1   | 35.71%     | ⏳           | ⏳         | ⏳          | ⏳          |
|            | EN 301-549 | 35.42%     | ⏳           | ⏳         | ⏳          | ⏳          |
| iOS        | RAAM 1.1   | 28.57%     | ⏳           | ⏳         | ⏳          | ⏳          |
|            | EN 301-549 | 20.83%     | ⏳           | ⏳         | ⏳          | ⏳          |

<br>

## 📋 Légende

🟠 : Correction disponible à la vérification  
🟢 : Correction validée  
🔴 : Correction invalidée

<br>

## ✅ Corrections 26 août → 26 septembre

<details>

<summary> 🟠 Critère 1.2 - Chaque élément graphique porteur d’information possède-t-il une alternative accessible aux technologies d’assistance ?</summary>

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

## 💡 Questions

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

</details>
