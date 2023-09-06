## Installation - web

To run the **pass Culture** web application on your browser, simply run:

- Change `API_BASE_URL` of `.env.testing` to your local server (`http://127.0.0.1:5001` by default, do not use `localhost`, it doesn’t work)
- `yarn start:web:testing` to run the app in testing environment.

You can choose between multiple environments (development, testing, staging, integration & production). See `package.json` to see the available scripts.
