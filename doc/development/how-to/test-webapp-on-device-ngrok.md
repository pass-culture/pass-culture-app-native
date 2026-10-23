## Tester l'application web sur un appareil réel avec ngrok

Objectif : accéder à votre application web locale (connectée à votre backend local) depuis un téléphone ou tout autre appareil, en l'exposant via [ngrok](https://ngrok.com/).

Prérequis : être en mesure de faire fonctionner l'application web avec un backend local ; voir [Développer avec une API locale](./run-local-api.md).

Seule l'application web doit être exposée : en phase de développement, l'application web appelle l'API sur sa propre origine (`API_BASE_URL` est défini sur `''` dans `src/libs/environment/env.web.ts`), et le serveur de développement Vite redirige (via un proxy) les requêtes vers `/native` et `/saml` vers `API_BASE_URL` depuis votre ordinateur (voir `proxyConfig` dans `vite.config.js`). Aucun tunnel vers le backend ni modification des règles CORS n'est nécessaire.

### Étapes

- [ ] Lancez le backend (dépôt `pass-culture-main`) : `pc start-backend`
- [ ] Lancez l'application web en autorisant les hôtes ngrok : `API_BASE_URL=http://localhost:5001 __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=.ngrok-free.app yarn start:web:testing`
- [ ] Exposez l'application : `ngrok http 5173` (remplacez `5173` par le port affiché par Vite)
- [ ] Sur l'appareil, ouvrez l'URL ngrok en **https**, puis cliquez sur « Visit Site » sur la page d'avertissement affichée par ngrok.

> `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` est une variable interne de Vite. Si Vite renvoie l'erreur « Blocked request. This host is not allowed » (ou si ngrok affiche un domaine différent de `ngrok-free.app`), ajoutez `allowedHosts: ['.<domaine ngrok>']` dans la section `server` du fichier `vite.config.js` (attention : ne committez pas cette modification).

Utilisez l'URL en https : certaines fonctionnalités (comme la géolocalisation) nécessitent un contexte sécurisé. ### Alternative sans ngrok

Le fichier `vite.config.js` inclut déjà la configuration `host: true` : sur le même réseau Wi-Fi, ouvrez sur votre appareil l'URL « Network » indiquée par Vite (`http://<adresse IP locale de votre ordinateur>:5173`). Les fonctionnalités nécessitant un contexte sécurisé (géolocalisation, etc.) ne fonctionneront pas via HTTP.
