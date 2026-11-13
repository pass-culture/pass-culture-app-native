# E2E web

Smoke tests [Playwright](https://playwright.dev/) de l'app web, joués contre l'API de staging.

## Installation

```bash
yarn playwright install chromium
```

Créer `e2e/web/.env.secret` (ignoré par git). Les valeurs sont dans l'entrée **`Secrets E2E`** du gestionnaire de mots de passe :

| Variable | Clé dans `Secrets E2E` |
|---|---|
| `E2E_API_BASE_URL` | `MAESTRO_E2E_BASE_URL` |
| `E2E_API_KEY` | `MAESTRO_E2E_API_KEY` |
| `E2E_USER_PASSWORD` | `MAESTRO_PASSWORD` |

## Lancement

| Commande | Effet |
|---|---|
| `yarn test:e2e:web` | Tous les tests |
| `yarn test:e2e:web e2e/web/tests/booking` | Un seul domaine |
| `yarn test:e2e:web --ui` | Mode UI de Playwright |

Playwright build l'app staging puis la sert avec `vite preview` sur `http://127.0.0.1:5173` ; les appels API passent par le proxy de `vite preview` vers staging. Pas de hot reload : un serveur déjà lancé sur ce port est réutilisé, il faut l'arrêter pour tester une modification de l'app.

En cas d'échec, la trace est conservée dans `test-results/` : `yarn playwright show-trace <chemin>/trace.zip`.

## Organisation

```text
e2e/web/
├── fixtures.ts        # page objects et données de test injectés dans les tests
├── helpers/e2eApi.ts  # création d'utilisateurs et d'offres via les routes /e2e de l'API
├── pages/             # page objects
└── tests/<domaine>/   # specs
```

- Chaque test qui en a besoin crée son propre utilisateur (`beneficiaryUser`, `authenticatedPage`) ou sa propre offre (`cinemaOffer`, désactivée en fin de test).
- Les parcours critiques sont tagués `@smoke`.
- Les sélecteurs vivent dans les page objects et passent par les rôles et libellés accessibles (`getByRole`, `getByLabel`).

## CI

[`dev_on_pull_request_run_e2e_web.yml`](../../.github/workflows/dev_on_pull_request_run_e2e_web.yml) lance `yarn test:e2e:web` à chaque push, avec les mêmes secrets GCP que Maestro. Les résultats sont postés sur Slack ; en cas d'échec, les traces sont dans l'artefact `playwright-traces` du run.
