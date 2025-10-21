# DR022 : Principe de Responsabilité Unique (SRP)

> Statut : Adopté

## Décision

Chaque composant, hook ou fonction doit avoir une **unique et bien définie responsabilité**. Un composant doit se concentrer sur le rendu, un hook sur une logique spécifique (état, effet de bord, calcul), et une fonction sur une tâche atomique. Un module ne doit pas connaître les détails d'implémentation de ses dépendances, mais seulement leur intention.

## Contexte

Des composants ou fonctions monolithiques qui gèrent trop de responsabilités sont difficiles à comprendre, à tester et à maintenir. Ils entraînent un couplage fort et une faible réutilisabilité. Par exemple, un composant qui à la fois récupère des données, les transforme, gère l'état de l'UI, et envoie des événements analytics viole le SRP.

## Justification

- **Clarté et Lisibilité :** Un code avec des responsabilités claires est plus facile à lire et à comprendre.
- **Testabilité :** Des unités de code plus petites et focalisées sont beaucoup plus simples à tester unitairement.
- **Maintenabilité :** Les changements dans une responsabilité n'affectent pas les autres, réduisant le risque de régressions.
- **Réutilisabilité :** Des unités de code avec une seule responsabilité sont plus faciles à réutiliser dans différents contextes.
- **Découplage :** Le code devient moins dépendant des détails d'implémentation, ce qui facilite les évolutions.

## Diagramme : Séparation des responsabilités (SRP)

```mermaid
graph TD
    subgraph "Avant (Violation du SRP)"
        Monolith["Composant Monolithique (ex: UserProfilePage)"]
        Monolith -- Contient --> DataFetch["Récupération de données (API)"]
        Monolith -- Contient --> BusinessLogic["Logique métier complexe (calcul âge)"]
        Monolith -- Contient --> SideEffects["Effets de bord (Analytics)"]
        Monolith -- Contient --> Navigation["Logique de Navigation"]
        Monolith -- Contient --> UI_Render["Rendu UI (JSX)"]
    end

    subgraph "Après (Respect du SRP)"
        PageComp["Page d'Orchestration (ex: UserProfilePage)"]
        ViewModelHook["Hook ViewModel (ex: useUserProfileViewModel)"]
        ViewComp["Composant de Vue (ex: UserProfileView)"]
        PureFunc["Fonction Pure (ex: calculateUserAge)"]
        DataHook["Hook de Données (ex: useUserQuery)"]
        SideEffectHook["Hook d'Effet de Bord (ex: useTrackUserProfileView)"]

        PageComp -- Appelle --> ViewModelHook
        ViewModelHook -- Fournit Props/Callbacks --> ViewComp
        PageComp -- Rend --> ViewComp

        ViewModelHook -- Utilise --> DataHook
        ViewModelHook -- Utilise --> PureFunc
        ViewModelHook -- Utilise --> SideEffectHook
        ViewModelHook -- Gère --> Navigation[Navigation]

        DataHook -- Récupère --> API[API]
        PureFunc -- Transforme --> Data[Données]
        SideEffectHook -- Déclenche --> Analytics[Analytics]
    end

    style Monolith fill:#f9f,stroke:#333,stroke-width:2px
    style PageComp fill:#ccf,stroke:#333,stroke-width:2px
    style ViewModelHook fill:#9cf,stroke:#333,stroke-width:2px
    style ViewComp fill:#cfc,stroke:#333,stroke-width:2px
    style PureFunc fill:#ffc,stroke:#333,stroke-width:2px
    style DataHook fill:#cff,stroke:#333,stroke-width:2px
    style SideEffectHook fill:#fcf,stroke:#333,stroke-width:2px
```

Pour des exemples concrets d'application de ce principe, y compris un refactoring pas à pas d'un module legacy, veuillez consulter le document [exemple.md](../architecture/exemple.md).```
