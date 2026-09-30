## 🤖 Générer la description de cette PR avec Copilot

> [!IMPORTANT]
> Ce contenu est un **guide** : remplace-le entièrement par la description générée.
> Tu préfères rédiger à la main ? Utilise [l'ancien template][manual] (ajoute `&template=manual.md` à l'URL de cette page, ou copie-le depuis le lien).

### Prérequis

- VS Code + extension **GitHub Copilot Chat**
- `chat.promptFiles` activé (déjà configuré dans `.vscode/settings.json` du repo)

### Étapes

1. Sur ta branche, ouvre **Copilot Chat** en mode **Agent** (il doit pouvoir lancer des commandes `git`).
2. Tape `/pr-description` — tu peux ajouter du contexte : `/pr-description le but est de …`
3. Copilot analyse le diff avec `master`, déduit le ticket depuis le nom de branche et propose :
   - un **titre** au format `(PC-XXXXX) type(scope): summary`
   - une **description** dans un bloc markdown copiable
4. Colle la description ici **à la place de ce guide**, et le titre dans le champ titre.
5. Ajoute tes **screenshots / vidéos** à la main (Copilot ne peut pas les uploader).

### Mettre à jour une description existante

Relance `/pr-description` en collant la description actuelle : seules les sections impactées par les nouveaux commits sont réécrites.

[manual]: https://github.com/pass-culture/pass-culture-app-native/blob/master/.github/PULL_REQUEST_TEMPLATE/manual.md?plain=1
[prompt]: https://github.com/pass-culture/pass-culture-app-native/blob/master/.github/prompts/pr-description.prompt.md
