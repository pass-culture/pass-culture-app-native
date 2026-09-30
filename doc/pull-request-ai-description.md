## Générer la description de PR avec l'IA 🤖

### Why

- La description est le point d'entrée du reviewer : intention, changements, comment tester, visuels.
- Le skill `pr-description` applique automatiquement nos conventions (titre, ticket Jira, structure, walkthrough).

### Key points

#### Le skill

Source unique : [`.agents/skills/pr-description/SKILL.md`](../.agents/skills/pr-description/SKILL.md) (standard ouvert [Agent Skills](https://agentskills.io)).

#### Utilisation selon l'outil

| Outil                                          | Détection du skill                           | Lancement                                                             |
| :--------------------------------------------- | :------------------------------------------- | :-------------------------------------------------------------------- |
| VS Code + GitHub Copilot Chat (mode **Agent**) | Automatique (`.agents/skills/`)              | `/pr-description`                                                     |
| Cursor (chat Agent)                            | Automatique (`.agents/skills/`)              | `/pr-description`                                                     |
| Claude Code                                    | ⚠️ Pas encore (ne lit que `.claude/skills/`) | « Suis les instructions de `.agents/skills/pr-description/SKILL.md` » |

> Claude Code : en attendant le support de `.agents/skills/`, tu peux aussi créer un symlink local non versionné :
>
> ```bash
> mkdir -p .claude/skills
> ln -s ../../.agents/skills/pr-description .claude/skills/pr-description
> echo ".claude/skills/pr-description" >> .git/info/exclude
> ```

#### Étapes

1. Sur ta branche, lance le skill (tu peux ajouter du contexte : `/pr-description le but est de …`).
2. L'agent analyse le diff avec `master`, déduit le ticket depuis le nom de branche et propose :
   - un **titre** au format `(PC-XXXXX) type(scope): summary` (voir [PR title format](./pull-request.md))
   - une **description** dans un bloc markdown copiable
3. Colle la description dans la PR **à la place du template**, et le titre dans le champ titre.
4. Ajoute tes **screenshots / vidéos** à la main (l'agent ne peut pas les uploader).

#### Mettre à jour une description existante

Relance le skill en collant la description actuelle : seules les sections impactées par les nouveaux commits sont réécrites.

### Mistakes to avoid when following the standard

- Coller la description sans la relire : l'intention doit refléter le vrai besoin métier.
- Oublier les visuels pour un changement UI.
- Laisser le texte du template dans la PR.

### Resources

- [PR title format](./pull-request.md)
- [Template manuel](../.github/PULL_REQUEST_TEMPLATE/manual.md)
