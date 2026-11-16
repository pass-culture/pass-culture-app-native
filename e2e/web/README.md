# E2E web

Tests [Playwright](https://playwright.dev/) de l'app web, joués sur un build staging contre l'API de staging.

## Installation

Télécharger le navigateur (une fois, puis après chaque montée de version de Playwright) :

```bash
yarn playwright install chromium
```

Créer le fichier `e2e/web/.env.secret`. Son contenu est disponible dans le gestionnaire de mots de passe sous le nom `Secret E2E Web Jeune`.

## Lancer les tests

| Commande | Effet |
|---|---|
| `yarn test:e2e:web` | Tous les tests |
| `yarn test:e2e:web e2e/web/tests/booking` | Un dossier ou un fichier |
| `yarn test:e2e:web -g "favorites"` | Les tests dont le nom correspond |
| `yarn test:e2e:web --grep @tag_au_choix` | Les tests d'un tag |
| `yarn test:e2e:web --ui` | Mode UI : relancer, filtrer, voir chaque étape |
| `yarn test:e2e:web --headed` | Voir le navigateur |
| `yarn test:e2e:web --debug` | Pas à pas avec l'inspecteur |

Playwright lance automatiquement le build staging puis le sert avec `vite preview` sur `http://127.0.0.1:5173` ; les appels API passent par le proxy de `vite preview` vers staging. 

Il n'y a pas de hot reload : après une modification de l'app, il faut relancer les tests pour rebuild. Un serveur déjà lancé sur ce port est réutilisé sans rebuild.

## Déboguer un test

Le mode UI (`yarn test:e2e:web --ui`) est le plus pratique : il rejoue le test en direct et montre, pour chaque étape, l'état de la page, les appels réseau et la console. Son bouton **Pick locator** donne le sélecteur d'un élément en cliquant dessus.

Les échecs laissent aussi une trace dans `test-results/` (en CI, dans l'artefact `playwright-traces` du run), à ouvrir avec `yarn playwright show-trace <chemin>/trace.zip`.

## Écrire un test

Importer `test` et `expect` depuis `fixtures.ts`, puis demander les page objects et les données dont le test a besoin :

```ts
import { expect, test } from '../../fixtures'

test('a beneficiary user can add an offer to their favorites', async ({
  authenticatedPage,
  offerPage,
  cinemaOffer,
}) => {
  await offerPage.goto(cinemaOffer.id)
  await offerPage.addToFavorites()

  await expect(offerPage.unfavoriteButton).toBeVisible()
})
```

## Organisation

```text
e2e/web/
├── fixtures.ts        # page objects et données de test injectés dans les tests
├── helpers/e2eApi.ts  # création d'utilisateurs et d'offres via les routes /e2e de l'API
├── pages/             # page objects
└── tests/<domaine>/   # specs
```

- Chaque test crée ses propres données via les fixtures : utilisateur (`beneficiaryUser`, `authenticatedPage`) ou offre (`cinemaOffer`, désactivée en fin de test). Pour un nouveau besoin, ajouter une fixture plutôt que dépendre des données de staging.
- Les sélecteurs vivent dans les page objects et passent par les rôles et libellés accessibles (`getByRole`, `getByLabel`).
- Les parcours critiques sont tagués `@smoke`.

## CI

[`dev_on_pull_request_run_e2e_web.yml`](../../.github/workflows/dev_on_pull_request_run_e2e_web.yml) lance `yarn test:e2e:web` à chaque push et poste le résultat sur Slack.
