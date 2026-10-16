## Test the webapp on a real device with ngrok

Goal: open your local webapp (connected to your local backend) from a phone or any other device, by exposing it with [ngrok](https://ngrok.com/).

Prerequisite: be able to run the webapp with a local backend, see [Develop with a local API](./run-local-api.md).

Only the webapp needs to be exposed: in development, the webapp calls the API on its own origin (`API_BASE_URL` is set to `''` in `src/libs/environment/env.web.ts`), and the Vite dev server proxies `/native` and `/saml` to `API_BASE_URL` from your computer (see `proxyConfig` in `vite.config.js`). No backend tunnel nor CORS change is needed.

### Steps

- [ ] Start the backend (repo `pass-culture-main`): `pc start-backend`
- [ ] Start the webapp, allowing the ngrok hosts: `API_BASE_URL=http://localhost:5001 __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=.ngrok-free.app yarn start:web:testing`
- [ ] Expose it: `ngrok http 5173` (replace `5173` by the port displayed by Vite)
- [ ] On the device, open the **https** ngrok URL, then click "Visit Site" on the ngrok warning page

> `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is an internal Vite variable. If Vite answers `Blocked request. This host is not allowed` (or if ngrok displays another domain than `ngrok-free.app`), add `allowedHosts: ['.<ngrok domain>']` to `server` in `vite.config.js`, and do not commit it.

Use the https URL: some features (geolocation...) require a secure context.

### Alternative without ngrok

`vite.config.js` already sets `host: true`: on the same Wi-Fi network, open on the device the `Network` URL displayed by Vite (`http://<local IP of your computer>:5173`). Features requiring a secure context (geolocation...) won't work over http.
