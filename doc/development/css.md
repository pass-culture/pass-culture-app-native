## App css

We use css-in-js with `styled-components` to customize our components, in some case, you might want to add extra global css.

## Base css

We use `public/index.html` as the main entrypoint of our web application, which can include base css for our app.

> This will reduce the amount of requests to get assets. Also, it will later be minified during build.

You can add base css in `web/css`, it will be automatically injected in `index.html`.

- Use a two digit and dash prefix for ordering the css, ex: `11-` : `11-mycss.css`
- Append `dev-` to the digit if it's only required in development, ex: (`11-dev-mycss.css`)
