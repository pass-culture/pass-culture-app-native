# Remplacement de CodePush

## Context and Problem Statement

Le service historique d'update OTA (Over The Air) utilisé au pass était CodePush avec AppCenter proposé par Microsoft.
Ce service a été interrompu le 31/03/2025.

Afin de pouvoir continuer à proposer des mises à jours en OTA en testing comme en production une alternative est nécessaire.

Nous utilisons le service pour faire des HotFix en production et en testing pour ne pas avoir à build complètement l'app à chaque merge sur master.

## Decision Drivers

* Coût de run
* Coût de mise en place
* Intégration dans nos pipelines de CI/CD
* Le fait que le service / la lib soit maintenu
* Est-ce que la nouvelle architecture est supportée

## Considered Options

| Solution             | Coût                                        |
|----------------------|---------------------------------------------|
| Self-hosted CodePush | à estimer mais faible                       |
| EAS                  | 0€                                          |
| Revopush             | 90$ / mois                                  |
| AppZung              | + de 1000$ / mois                           |
| Pas de CodePush      | 0€                                          |
| Hot-Updater          | 0€ (+ coût du provider - nul avec Firebase) |

## Decision Outcome

En cours...

### Confirmation

{Describe how the implementation of/compliance with the ADR can/will be confirmed. Are the design that was decided for and its implementation in line with the decision made? E.g., a design/code review or a test with a library such as ArchUnit can help validate this. Not that although we classify this element as optional, it is included in many ADRs.}

## Pros and Cons of the Options

### Self hosted CodePush

Héberger la lib CodePush mise à disposition par Microsoft [1]

* Good, because déjà implémenté dans notre Codebase (aucun changement côté front à part de la conf)
* Good, because on connaît déjà le fonctionnement
* Neutral, because Serveur avec des pics de charge importants lors d'un HF en prod => scaling un peu flou
* Bad, because la lib ne sera pas maintenue par Microsoft
* Bad, because la nouvelle archi RN ne sera pas supportée

### External services (EAS / AppZung / RevoPush / Codemagic)

Plusieurs services externes proposent des solutions d'OTA payantes (se basant souvent sur la lib CodePush Microsoft).

* Good, because changement mineur côté Front + config
* Good, because supporte la nouvelle archi
* Neutral, because {argument c}
* Bad, because coût important ou très important (souvent facturé à la requête)

#### EAS

* Good, because la plateforme propose un environnement complet (déploiement, CI/CD, OTA)
* Good, because cela nous amènerait à utiliser Expo Core et des libs comme React Native SVG [2]
* Good because, grosse communauté, maintenance sûre et de qualité
* Bad because la migration vers Expo peut être conséquente
  * Mettre le lien de l'article sur la migration
  * Il est possible que des libs soient à remplacer (recensement nécessaire avant de se lancer)

#### AppZung / RevoPush / Codemagic

* Bad, because services plutôt jeunes lancés rapidement suite à l'arrêt de AppCenter
* Good, because moins cher qu'EAS
* Bad because, aucune certitude sur la maintenance à moyen/long terme

### On utilise plus de service OTA

* Good because, juste un clean à faire
* Bad because, plus de possibilité de faire de HF en prod sans soumettre une nouvelle version aux stores
* Bad because, il faut plus de temps pour déployer des versions en testing (rebuild complet à chaque merge) + il faut télécharger à nouveau la dernière version pour chaque commit

### Hot Updater

* Good because, on peut utiliser un provider au choix (self-hosted, Firebase...)
* Good because, supporte la nouvelle archi
* Good because, une console avec une interface est disponible pour gérer le type de mise à jour (forcée ou non)
* Good because, documentation à jour et complète [3]
* Good because, open source (MIT)
* Neutral, récent mais repo actif et maintenu par plusieurs personnes

Comment pourra-t-on gérer les anciennes versions hébergées sur le provider (logique de clean existante ? ou à prévoir ?)

#### Test avec Supabase

* Intégration facile avec un seul environnement

## More Information

On souhaite pouvoir suivre le nombre de mise à jour réalisées chez nos utilisateurs

[1]: https://github.com/microsoft/code-push-server
[2]: https://docs.expo.dev/versions/latest/sdk/svg/
[3]: https://gronxb.github.io/hot-updater/index.html
