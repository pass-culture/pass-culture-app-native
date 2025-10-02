#### DR010 : Structure modulaire par fonctionnalités (Vertical Slices)



> Statut : Adopté



##### Décision



**Tout le code relatif à une fonctionnalité sera regroupé dans un seul et même dossier.** Nous confirmons l’organisation par domaine métier (ex: `features/profile`, `features/search`).



##### Contexte



Notre analyse a révélé un **couplage massif** entre les fonctionnalités, avec **4 457 imports cross-features** et un score de couplage de 16.44%, bien au-delà du seuil critique de 10%. L'organisation actuelle donne une fausse impression d'autonomie et rend la maintenance difficile. Pour modifier une simple fonctionnalité, un développeur doit naviguer entre de multiples dossiers, ce qui augmente la charge cognitive et le risque d'erreurs.



##### Alternatives considérées



- **Créer des librairies partagées massives :** Mettre toute la logique partagée dans un seul dossier `/shared`. Rejeté car cela risquerait de recréer un nouveau monolithe déguisé.



##### Justification



1. **Autonomie des équipes :** Les équipes peuvent travailler en parallèle sur des fonctionnalités différentes avec un risque minimal de conflits.
2. **Maintenance simplifiée :** Un bug dans le profil ? Le code est au même endroit.
3. **Intégration rapide :** Un nouveau développeur peut devenir productif rapidement en se concentrant sur le périmètre d'une seule fonctionnalité.



##### Conséquences



- **Positives :** Réduction du couplage, augmentation de la vélocité, maintenance plus facile.
- **Négatives :** Nécessite une discipline pour bien définir les frontières entre les fonctionnalités et gérer la logique réellement partagée (qui ira dans un dossier `shared/` ou `libs/`).



##### Diagramme



Extrait de code

```mermaid
graph TD
    subgraph Ancienne Approche par couche
        Dev_A("Développeur A")
        Dev_A -- Navigue entre --> C1("/components")
        Dev_A -- Navigue entre --> S1("/screens")
        Dev_A -- Navigue entre --> H1("/hooks")
    end

    subgraph Nouvelle Approche par fonctionnalité
        Dev_B("Développeur B")
        Dev_B -- Travaille dans --> F1("features/profile")
        F1 --- C2("components")
        F1 --- S2("screens")
        F1 --- H2("hooks")
    end
```



##### Actions à implémenter



1. Toute nouvelle fonctionnalité doit suivre cette structure.
2. Lors du refactoring d'un module legacy, il devra être migré vers cette structure.
3. Un dossier `libs/` ou `shared/` sera utilisé pour le code véritablement transverse (ex: client API, design system).



##### Output



Une structure de répertoires claire et standardisée qui favorise l'autonomie et la maintenabilité.