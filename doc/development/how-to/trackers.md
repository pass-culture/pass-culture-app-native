# Comment ajouter un tracker

## Pourquoi

Pour accéder à des analyses (analytics), nous avons besoin de trackers. À cette fin, nous utilisons Firebase pour enregistrer les événements déclenchés par les interactions des utilisateurs. Cette documentation explique comment implémenter un tracker sur un bouton.

## Points clés

1. Exécutez le script `yarn add:tracker <NomDuTracker>` en utilisant le format PascalCase pour `<NomDuTracker>` (`--provider=firebase` est le fournisseur par défaut — et le seul disponible). Ce script ne crée pas de nouveaux fichiers ; il ajoute l'événement, la fonction `log<NomDuTracker>` ainsi que son « mock » (simulation) dans les fichiers existants listés ci-dessous. Ajoutez manuellement les paramètres de l'événement si nécessaire. 

<details>
<summary>Ajout manuel</summary>
Ajoutez un événement Firebase dans votre code (en respectant l'ordre alphabétique) :

a. Pour Firebase, ajoutez votre événement dans [src/libs/firebase/analytics/events.ts](../../../src/libs/firebase/analytics/events.ts). 
b. Ajoutez une fonction nommée `log<NomDeVotreÉvénement>` dans [src/libs/analytics/logEventAnalytics.ts](../../../src/libs/analytics/logEventAnalytics.ts). Dans cette fonction, appelez la méthode `logEvent` issue de `analytics` (provenant de [src/libs/analytics/provider.ts](../../../src/libs/analytics/provider.ts)) en lui transmettant le(s) nom(s) de l'événement Firebase. Si aucun nom d'événement n'est spécifié pour un fournisseur donné, l'événement ne sera pas déclenché par ce fournisseur. 

c. Ajoutez une simulation (« mock ») de votre fonction dans [src/libs/analytics/__mocks__/logEventAnalytics.ts](../../../src/libs/analytics/__mocks__/logEventAnalytics.ts).
</details>

2. Appelez votre fonction d'analyse au sein d'un « callback » (fonction de rappel) avant de la transmettre en tant que « prop » à votre bouton.

3. Vérifiez le comportement dans Firebase :

a. Ouvrez la console Firebase et accédez à la [DebugView du projet de test](https://console.firebase.google.com/project/pc-native-testing/analytics/app/android:app.passculture.testing/debugview/realtime~2Fdebugview%3Ffpn%3D557258398232) (voir [Test manuel du suivi](#manually-testing-tracking)).

b. Repérez votre appareil dans la liste (`arm64` correspond aux processeurs M1, `x86_64` aux processeurs macOS classiques).
b2. Si vous êtes bien connecté(e), vous pouvez vérifier dans la DebugView que l'identifiant utilisateur (`user_id`) correspond à celui utilisé dans vos « codes de triche » (cheat codes). 

c. Recherchez votre événement dans la liste des événements en temps réel (le chargement peut parfois être un peu lent).

## Erreurs à éviter lors de l'application de la norme

- Oublier de créer le « mock » (objet simulé) : vous ne pourrez alors pas vérifier si votre fonction est bien appelée.
- Ne pas ajouter votre événement par ordre alphabétique.
- Ne pas respecter la convention de nommage (PascalCase pour Firebase).
- Consulter le mauvais appareil dans la DebugView Firebase ; pour éviter cela, effectuez quelques actions dans l'application au préalable et vérifiez si les événements correspondants apparaissent.
- Ne pas autoriser l'application à collecter vos données lors de la première ouverture.

# Test manuel du suivi

Nous utilisons la DebugView du projet Firebase pour visualiser les données analytiques en temps réel.

[Voici le lien vers la DebugView pour l'environnement de test](https://console.firebase.google.com/project/pc-native-testing/analytics/app/android:app.passculture.testing/debugview/realtime~2Fdebugview%3Ffpn%3D557258398232)

Conseil général pour toutes les plateformes :
- Pour vous assurer que vous examinez bien le bon appareil, vérifiez la présence du champ `user_id` dans les événements : il doit correspondre à l'identifiant de l'utilisateur avec lequel vous vous êtes connecté(e) sur votre appareil. ## Simulateur iOS
- Pour permettre l'envoi d'événements analytiques en temps réel (sans délai), assurez-vous que l'argument `-FIRDebugEnabled` est ajouté aux arguments de lancement du schéma actif (au moment de la rédaction de ce guide, cet argument est déjà inclus dans le dépôt).
- Sur le simulateur, veillez à accepter les cookies et à autoriser le suivi dans les paramètres d'autorisations.
- Dans le projet de test Firebase, accédez à `DebugView`.
- Sélectionnez l'appareil ; il devrait apparaître sous une forme telle que : « Apple arm64 ».

## Émulateur Android
- Pour permettre l'envoi d'événements en temps réel :
```sh
adb shell setprop debug.firebase.analytics.app app.passculture.testing
```
- Il suffit d'exécuter cette commande une seule fois par émulateur ; toutefois, si vous changez d'émulateur, vous devrez la saisir à nouveau. - Cette fois, l'appareil portera un nom du type : `sdk_gphone64_arm64`

## Application Web
- Assurez-vous que votre bloqueur de publicités (Ad Blocker) est désactivé.
- Activez l'extension « Google Analytics Debugger ».
- Dans `DebugView`, vous verrez votre appareil apparaître sous la rubrique « Apple » si vous utilisez un MacBook.
- Vous verrez également, dans la console Chrome, des journaux (logs) qui ressemblent à ceci :
```
Processing GTAG command: ["config", "G-WMFLLWGV80", {update: true, user_id: "67"}]

Processing GTAG command: ["event", "ModuleDisplayedOnHomePage", {call_id: "b9f9d257-c6c2-4e39-8901-9a086c21bd2a", homeEntryId: "6CRGedke4bdzOG21W4JMt2", hybridModuleOffsetIndex: "3", index: "3", moduleId: "2nxp1f7pw8lTkkt1Iz6yO4", moduleType: "hybrid", offers_1_10: "282,2665,2664", locationType: "undefined", agentType: "browser_computer", app_version: "1.371.0", app_revision: "66791993cdcd", send_to: "G-WMFLLWGV80"}]
```
### Débogage de l'application Web
Vérifiez l'onglet « Network » (Réseau) :
1. Ouvrez les outils de développement Chrome (Chrome Developer Tools) et accédez à l'onglet **Network**.
2. Filtrez les résultats en saisissant le terme `collect`.
3. Déclenchez un événement dans votre application.
4. Si une requête s'affiche en **rouge (bloquée)**, cela signifie qu'un bloqueur de publicités est actif.
5. Si la requête aboutit (statut 204 OK), cliquez dessus et examinez la section « Payload » (Charge utile). 6. Recherchez `_dbg: 1` : s'il est présent, il apparaîtra dans DebugView.
