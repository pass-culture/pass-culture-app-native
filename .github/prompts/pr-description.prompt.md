---
agent: agent
description: Write or update the description (and title) of the current PR following pass Culture app-native conventions.
---

# PR description (pass Culture app-native)

Objectif : produire une description de PR **agréable et rapide à relire par un humain**.
Toujours dans cet ordre : (1) l'**intention/motivation** en 1 à 3 phrases max, puis (2) la **liste des changements**.

## Workflow

1. **Récupère le contexte du diff** (ne te fie pas qu'au dernier commit) :

```bash
git fetch origin master --quiet
git log master..HEAD --pretty=format:'%h %s'          # commits de la branche (hash + sujet)
git rev-list --count master..HEAD                     # nombre de commits
git diff master...HEAD --stat                          # fichiers touchés (global)
git log master..HEAD --stat --pretty=format:'%n=== %h %s ==='  # fichiers touchés par commit
git rev-parse --abbrev-ref HEAD                        # nom de branche (ticket)
```

> Si la branche contient **plusieurs commits**, garde la correspondance commit → fichiers : elle sert à structurer la liste des changements (voir Format).

2. **Déduis le ticket** depuis le nom de branche (`PC-XXXXX`, `IC-XXXX`) et construis le lien Jira `https://passculture.atlassian.net/browse/PC-XXXXX`. Si rien n'est trouvé, laisse le placeholder ou utilise `(BSR)` (Boy Scout Rule).
3. **Rédige** la description (voir Format) puis **affiche-la** à l'utilisateur. **Fournis TOUJOURS la description finale dans un unique bloc de code markdown séparé** (fenced ` ```markdown `), afin qu'elle soit facilement copiable/collable telle quelle dans le champ description de la PR. Ne pousse/édite la PR (`gh pr edit`) que si l'utilisateur le demande explicitement.
4. **Mise à jour** : si une description existe déjà, conserve la structure, ne réécris que les sections impactées par les nouveaux changements.

## Titre de PR

Format observé sur ce repo : `(PC-XXXXX) type(scope): courte description en anglais`

- type : `feat` | `fix` | `chore` | `refactor` | `clean` | `build` | `ci` | `docs` | `test`
- scope : nom de la feature/du module touché (ex. `auth`, `search`, `booking`), en minuscule
- Sans ticket : préfixe `(BSR)` (Boy Scout Rule).
- Exemples réels : `(PC-43872) fix(auth): fix email lost when navigating signup steps`, `(PC-43824) feat(a11y): add new following file 2026_11_25 for web`.

## Format de la description

> **Bloc copiable** : rends toujours la description finale dans un seul bloc de code. Comme elle contient elle-même des fences ` ``` ` (mermaid, tableaux, exemples), englobe-la dans une clôture en **4 backticks** (` ````markdown `) pour ne pas casser le rendu.

Structure cible :

```markdown
## 🎯 Related Ticket

[Ticket Jira](https://passculture.atlassian.net/browse/PC-XXXXX)

> Intention en 1 à 3 phrases : *pourquoi* ce changement, le problème résolu / la valeur apportée.

### 🔧 Changements
- Changement 1 (orienté « quoi » + impact, pas un dump de diff)
- Changement 2
- ...

### 🧪 Comment tester
- Étapes / commandes / résultat attendu
```

Règles de rédaction :

- **Intention d'abord, liste ensuite.** L'intention parle métier/utilisateur, pas implémentation. Relève les algorithmes ou les choix architecturaux notables. Utilise le lien Jira ou Notion pour enrichir la description avec ce contexte.
- **Sépare les changements par commit** dès que la PR en contient **plusieurs** : un sous-titre par commit, avec son sujet (et son hash court), puis les changements de ce commit en dessous. Pour un **commit unique**, garde une simple liste à plat (pas de sous-titre inutile).
- **Anglais pour le code** (noms de fichiers, symboles) ; le texte narratif peut être en français comme dans l'équipe.
- **Markdown soigné** : titres, listes, tableaux, `code` inline. Emojis avec parcimonie (1 par section max).
- Si un commit regroupe beaucoup de changements hétérogènes, tu peux sous-grouper par thème à l'intérieur (ex. `Front`, `Tests`).
- Ignore les commits de bruit (merge master, `fix lint`, `wip`) : fusionne-les dans le commit pertinent ou omets-les plutôt que d'en faire une section.
- Évite le bruit : ne liste pas les changements triviaux générés (lockfiles, snapshots) sauf s'ils sont le sujet.

Exemple de liste de changements pour une PR **multi-commits** :

```markdown
### 🔧 Changements

#### `a1b2c3d` feat: add exposure page
- Nouvelle page `ExposurePage` + route associée
- Appel API `getExposure` branché sur le store

#### `d4e5f6a` test: cover exposure page
- Tests unitaires `ExposurePage.spec.tsx`
- Mock du endpoint `getExposure`
```

### Bilan (quand pertinent)

Si utile pour le relecteur, ajoute un court bilan comparant l'implémentation au ticket Jira/Notion (la mémoire du « comment ça s'est passé ») :

- Choix d'architecture : ...
- Écarts au plan : ...
- Couverture de tests : ...

## Visuels (quand c'est pertinent)

Ajoute la section ci-dessous pour : régression visuelle corrigée, nouvelle feature produit, changement d'UX notable.

```markdown
## 🖼️ Before & After

Before | After
:---: | :---:
![before](url) | ![after](url)
```

- Vidéo/GIF pour un flow interactif. Demande les fichiers à l'utilisateur si tu ne les as pas (ne fabrique pas d'URL).
- Si tu as pris des screenshots toi-même, référence leur chemin local.

## Schémas mermaid (optionnel)

Quand un changement touche un flux, une machine à états ou une archi non triviale, ajoute un diagramme :

```markdown
\`\`\`mermaid
flowchart LR
  A[User] --> B{Eligible?}
  B -- yes --> C[Offer page]
  B -- no --> D[Fallback]
\`\`\`
```

N'en mets pas pour un changement linéaire/simple : ça doit clarifier, pas décorer.

## Sois force de proposition (inspiration CodeRabbit)

Ajoute, en fin de description, un encart synthétique quand la PR est non triviale :

```markdown
---
**🧭 Review effort : 3/5** — _raison courte (taille du diff, complexité logique, surface de test)._

**🗂️ Walkthrough**

| Fichier(s) | Résumé |
|---|---|
| `src/features/.../Foo.tsx` | … |
| `src/features/.../Foo.spec.tsx` | … |
```

Barème review effort (échelle 1–5) :

- **1** : trivial (renommage, copie, config).
- **2** : petit, logique localisée, bien testée.
- **3** : plusieurs fichiers, logique modérée.
- **4** : logique transverse / migration / impacts multiples.
- **5** : critique ou large surface (sécurité, paiement, archi).

Propose aussi, si pertinent : risques/points d'attention pour le relecteur, et un checklist de test ciblé (utilise les critères d'acceptance de la demande initiale Jira/Notion). Reste concis : ces ajouts servent le relecteur, ils ne doivent pas noyer l'intention.
