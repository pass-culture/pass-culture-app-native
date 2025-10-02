#### DR020 : Méthodologie de Refactorisation Legacy (Strangler Fig)

> Statut : Adopté

##### Décision

Nous adoptons officiellement le **pattern Strangler Fig (Figuier Étrangleur)** pour moderniser nos modules legacy. La transition se fera via un **Anti-Corruption Layer (ACL)** et sera contrôlée par des **feature flags**.

##### Contexte

Des modules critiques comme `LocationWrapper` (113 usages), `SearchWrapper` (173 usages) et `AuthWrapper` (46 usages) sont trop couplés et risqués pour être remplacés en une seule fois. Nous avons besoin d'une méthode de migration progressive qui garantit la stabilité et permet un rollback instantané.

##### Alternatives considérées

- **Réécriture "stop-the-world" :** Mettre en pause le développement de fonctionnalités pour réécrire le module. Rejeté car cela bloque la livraison de valeur métier et le risque d'échec est très élevé.
- **Refactoring sur place :** Modifier le code legacy directement. Rejeté car cela risque de propager la complexité et ne permet pas de valider la nouvelle architecture en parallèle.
- **Refactoring par couche technique** : mettre à jour tous les appels réseaux, puis tous les contextes, puis… . Rejecté car cela bloque la livraison de valeur métier et si on doit s’arrêter plus tôt rien ne sera fait.

##### Justification

Le pattern Strangler Fig est la méthode la plus sûre pour moderniser un système en production.

- **Faible risque :** L'ancien système continue de fonctionner pendant que le nouveau est construit et validé.
- **Déploiement progressif :** Les feature flags nous permettent de rediriger le trafic périmètre par périmètre (ex: d'abord la Recherche, puis la Home), et même de faire des tests A/B.
- **Rollback immédiat :** Si un problème survient, il suffit de désactiver un feature flag pour revenir à l'ancien système.
- **L'ACL** protège notre nouveau code des concepts et de la complexité du legacy.

##### Diagramme

Extrait de code

```mermaid
graph TD
    User("Requête Utilisateur") --> Bridge{"Feature Flag / ACL"}
    Bridge -- activé --> NewModule["✅ Nouveau Module Moderne"]
    Bridge -- désactivé --> LegacyModule["❌ Ancien Module Legacy"]
    NewModule --> Response("Réponse")
    LegacyModule --> Response
```

```mermaid
graph TD
    subgraph "Phase 1 & 2 : Analyse et Construction du Bridge (Sprint 0)"
        direction LR
        A1("Application") --> B1{"Feature Flag 'useModernLocation'<br/>(désactivé)"};
        B1 -- false --> C1["❌ Module Legacy<br/>(LocationWrapper)"];
        style C1 fill:#f9f,stroke:#333,stroke-width:2px

        %% Le Walking Skeleton ici consiste à construire le pont (ACL) et à prouver
        %% que le nouveau module peut coexister avec l'ancien.
        D1["(Walking Skeleton)<br/>Nouveau Module Moderne<br/>(vide pour l'instant)"];
        E1["Anti-Corruption Layer (ACL)<br/>Le 'pont' qui traduit Legacy <=> Moderne"];
        style D1 fill:#ccf,stroke:#333,stroke-width:2px
        style E1 fill:#9cf,stroke:#333,stroke-width:2px
    end

    subgraph "Phase 3 : Étranglement Progressif (Sprints 1-3)"
        A2("Application") --> ACL{"ACL / Bridge"};
        ACL -- lit --> FF{"Feature Flag"};

        subgraph "Sprint 1 : Tranche #1 - 'Étrangler' la lecture de la position"
            FF1["Flag activé pour 10% des utilisateurs"];
            ACL -- true --> NM1["✅ Nouveau Module<br/>(gère la lecture)"];
            ACL -- false --> LM1["❌ Module Legacy<br/>(gère tout le reste)"];
        end
        subgraph "Sprint 2 : Tranche #2 - 'Étrangler' la modification des préférences"
            FF2["Flag activé pour 50% des utilisateurs"];
            ACL -- true --> NM2["✅ Nouveau Module<br/>(gère lecture + modification)"];
            ACL -- false --> LM2["❌ Module Legacy<br/>(gère les cas restants)"];
        end
        subgraph "Sprint 3 : Tranche #3 - 'Étrangler' le reste des fonctionnalités"
            FF3["Flag activé à 100%"];
            ACL -- true --> NM3["✅ Nouveau Module<br/>(gère 100% des fonctionnalités)"];
            ACL -- false --> LM3["❌ Module Legacy<br/>(n'est plus appelé)"];
        end
    end

    subgraph "Phase 4 : Nettoyage (Sprint 4)"
        A3("Application") --> NM4["✅ Nouveau Module Moderne"];
        LM4_Removed---
        ACL_Removed---
        FF_Removed---
        
        LM4_Removed("❌ Module Legacy<br/>(Supprimé)");
        style LM4_Removed fill:#f9f,stroke:#f00,stroke-width:4px,stroke-dasharray: 5 5
        ACL_Removed("ACL / Bridge<br/>(Supprimé)");
        style ACL_Removed fill:#9cf,stroke:#f00,stroke-width:4px,stroke-dasharray: 5 5
        FF_Removed("Feature Flag<br/>(Supprimé)");
        style FF_Removed fill:#f90,stroke:#f00,stroke-width:4px,stroke-dasharray: 5 5
        style NM4 fill:#cfc,stroke:#333,stroke-width:2px
    end
```

##### Actions à implémenter

1. Le module `LocationWrapper` sera le projet pilote pour cette méthodologie.
2. Le processus suivra 4 phases : Analyse (1j), Construction du nouveau code + ACL (2j), Étranglement progressif (2-3j), Nettoyage (1j).
3. Créer des templates de code pour l'ACL et les hooks de "bridge" afin d'accélérer les futures migrations.

##### Output

Une feuille de route claire et sécurisée pour démanteler notre dette technique sans mettre en péril la production.
