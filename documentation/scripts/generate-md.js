// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GoogleGenAI } = require('@google/genai')
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.local' })

const ai = new GoogleGenAI({ apiKey: process.env.TEST_KEY })

const instructions = `À partir de ces informations, génère une documentation qui\u00a0:
1. Identifie le nom de la fonctionnalité principale.
2. Regroupe les comportements par contextes ou scénarios distincts (par exemple, "utilisateur connecté avec mot de passe", "utilisateur connecté via SSO", "utilisateur déconnecté", "avec paramètres d'URL spécifiques", etc.).
3. Pour chaque contexte/scénario, résume les règles de gestion ou les comportements attendus du système, en te basant sur les descriptions "should..." ou les actions décrites.
4. Utilise un langage clair et accessible, comme si tu rédigeais une documentation technique pour des développeurs ou des chefs de produit.
5. Structure la sortie avec des titres et des listes à puces pour une meilleure lisibilité.
6. Si possible, ajoute un titre général pour la documentation de la fonctionnalité.
Ne te contente pas de lister les tests, mais interprète-les pour décrire le fonctionnement de la fonctionnalité.

Le résultat attendu doit ressembler à ca\u00a0:
---
title: EmailResendModal
slug: /tests/emailresendmodal
---

# 🧪 Documentation des tests\u00a0: EmailResendModal

## 🧩 Comportement avec la configuration distante 'shouldLogInfo'

### Quand 'shouldLogInfo' est **désactivé**
- Ne doit **pas** envoyer de log à Sentry en cas d’erreur.

### Quand 'shouldLogInfo' est **activé**
- Doit envoyer un log à Sentry en cas d’erreur.

## 💡 Comportement de '<EmailResendModal />'

- Doit s’afficher correctement.
- Doit fermer la modale lorsque l’icône de fermeture est pressée.
- Doit enregistrer un événement analytics lors du clic sur le bouton "Renvoyer l’e-mail".
- Doit effectivement renvoyer l’e-mail lors du clic sur ce bouton.
- Doit afficher un minuteur après le clic sur "Renvoyer l’e-mail".
- Doit afficher un message d’erreur si l’envoi de l’e-mail échoue.
- Doit afficher un message d’erreur si le nombre maximal de renvois est atteint.
- Doit réinitialiser le message d’erreur lorsqu’une nouvelle tentative est faite.
- Doit afficher une bannière d’alerte lorsqu’il ne reste plus aucune tentative.

Fin du résultat attendu.

Voici les informations en entrée\u00a0: 

EmailResendModal
 When shouldLogInfo remote config is false
- should not log to Sentry on error


 When shouldLogInfo remote config is true
- should log to Sentry on error


 <EmailResendModal />
- should render correctly
- should dismiss modal when close icon is pressed
- should log analytics when resend email button is clicked
- should resend email when resend email button is clicked
- should display timer when resend email button is clicked
- should display error message when email resend fails
- should display error message when maximum number of resends is reached
- should reset error message when another resend attempt is made
- should display alert banner when there is no attempt left


`

async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-lite',
    contents: `${instructions}`,
  })
  console.log(response.text)
}

main()
