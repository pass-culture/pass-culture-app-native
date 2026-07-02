<details>

<summary> ⏳ Critère 1.1 - Chaque élément graphique de décoration est-il ignoré par les technologies d’assistance ?</summary>

**RAAM** : [Critère 1.1](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-1-1)  
**Ticket** : [PC-42384](https://passculture.atlassian.net/browse/PC-42384)  
**PR** : [#9864](https://github.com/pass-culture/pass-culture-app-native/pull/9864)

**Problème** 😱  
E02 - Les emojis qui sont utilisé pour la mention IA dans les descriptions des pages artiste ainsi que dans les accessibilityLabel des boutons “Voir tout” sont lues alors qu’elles ne devraient pas.

**Correction** 💡  
E02 - Les emojis sont enlevées des accessibilityLabel

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> ⏳ Critère  9.9 -  Dans chaque formulaire, les erreurs de saisie sont-elles accessibles ?</summary>

**RAAM** : [Critère 9.9](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-9-9)  
**Ticket** : [PC-42384](https://passculture.atlassian.net/browse/PC-42384)  
**PR** : [#9884](https://github.com/pass-culture/pass-culture-app-native/pull/9884)

**Problème** 😱  
E11 - Lors d'une erreur dans le choix de la date, pour lire l’erreur au lecteur d'ecran, il faut revenir en arrière dans l’input alors qu’il faudrait l’avoir au niveau du bouton “Continuer”

**Correction** 💡  
E11 - Ajout de l'erreur dans l'accessibility label du bouton 

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> ⏳ Critère  10.2 -  Dans chaque écran, l’ordre de restitution par les technologies d’assistance est-il cohérent ?</summary>

**RAAM** : [Critère 10.2](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-10-2)  
**Ticket** : [PC-42441](https://passculture.atlassian.net/browse/PC-42441)  

**Problème** 😱  
E15 - Android - l'activation du bouton "Voir moins" déplace le focus sur le composant "Plus d'options" du bloc "Passe le bon plan !", il faut que le focus reste sur le composant "Voir moins".

**Retours** 💡  
Non reproduis sur RedMi 12, device model : 23053RNO2Y, app version 1.398.0 
Le focus suivant le texte déplié est bien sur le voir moins.

**Retours audit** 🔥  
Texte

</details>

<br>

<details>

<summary> ⏳ Critère 11.10 - Dans chaque écran, les fonctionnalités activables au moyen d’un geste complexe sont-elles activables au moyen d’un geste simple ?</summary>

**RAAM** : [Critère 11.10](https://accessibilite.public.lu/fr/raam1.1/referentiel-technique.html#crit-11-1)  
**Ticket** : [PC-42367](https://passculture.atlassian.net/browse/PC-42367)  
**PR** : [#9877](https://github.com/pass-culture/pass-culture-app-native/pull/9877)

**Problème** 😱  
E02 - Dans le module vidéo, lorsqu'il y a plus de 3 offres associées il faut scroller horizontalement pour y accéder. Il faudrait une alternative à ce geste complexe

**Correction** 💡  
E02 : ajout du bouton “Voir tout” pour accéder à une page avec les offres disposées verticalement

**Retours audit** 🔥  
Texte

</details>

