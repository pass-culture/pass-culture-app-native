# Title : DR001 - Rédiger des Decision Record pour tracer les décisions structurantes

> Status : ~~Projet-~~ Proposé ~~- Adopté - Remplacé - Retiré~~

## Contexte

Nous avons besoin d’un moyen structuré pour documenter et partager les décisions techniques au sein du projet. L’absence de traçabilité des décisions peut entraîner une perte de contexte et des choix incohérents dans le temps. De plus, il est essentiel d’impliquer les équipes dans la formalisation des choix techniques et d’assurer une transmission efficace des connaissances.

Les Architecture Decision Records (ADRs) offrent une approche simple et efficace pour consigner ces décisions de manière pérenne. Ils permettent à toute l’équipe d’accéder facilement à l’historique des décisions et de comprendre leur justification.

## Décision

Nous adoptons les Architecture Decision Records (ADRs) comme méthode standard de documentation des décisions architecturales et techniques. Chaque décision significative sera enregistrée dans un fichier markdown au sein du dépôt de code sous un répertoire dédié (/doc/adr/nom_de_fichier.md).

nom_de_fichier = ADR + nnn + " - " + (le texte de la décision sur 64 car max).
ex : ADR001 - rédiger des adr.md

Les principes suivants guideront l’utilisation des ADRs :

1. Un outil de facilitation et de documentation
L’ADR ne se limite pas à la documentation, il sert aussi à expliciter et partager les décisions prises, améliorant ainsi la collaboration au sein de l’équipe.
1. Format as-code en markdown
L'utilisation du format markdown permet une intégration fluide dans le quotidien des développeurs, favorisant ainsi leur adoption et leur utilisation régulière.
1. Tracer toutes les décisions
Au début, il est recommandé de documenter toutes les décisions, même mineures. Avec le temps, nous affinerons la granularité en fonction de la maturité de l'équipe.
1. Une documentation événementielle et durable
Un ADR n’est jamais obsolète : il représente une décision prise à un instant donné avec le contexte correspondant. Une nouvelle décision peut le compléter ou l’amender, mais il reste une trace historique précieuse.
1. Responsabilité collective
Chaque développeur et membre de l’équipe doit être encouragé à rédiger et à maintenir les ADRs afin d’assurer leur pertinence et leur exhaustivité.

## Alternatives considérées

Ne pas documenter les décisions, en se reposant sur la mémoire collective.

Utiliser un outil externe de gestion documentaire comme Notion

## Justification

Facilite le suivi des décisions et leur compréhension par l’ensemble de l’équipe.

S’intègre directement au workflow des développeurs, augmentant ainsi les chances d’adoption.

Évite la perte d’information en cas de changement d’équipe ou de rotation des membres.

## Conséquences

Nécessite un effort initial pour rédiger les premiers ADRs.

Demande une discipline dans l’équipe pour maintenir cette documentation à jour.

En début de projet, nous devons tracer au moins une décision par semaine. Par la suite, une décision par sprint est un bon rythme. Si nous en traceons moins, nous sommes probablement en train de manquer des décisions importantes.

## Actions à mettre en place

1. Créer un répertoire /doc/adr dans le dépôt principal du projet.

1. Rédiger ce premier ADR pour en fixer le cadre et les principes d’adoption.

1. Former l’équipe sur l’écriture et la mise à jour des ADRs.

1. Intégrer la revue des ADRs dans le workflow de revue de code.

1. Faire un bilan trimestriel pour ajuster et améliorer la pratique selon les retours des équipes.
