# Code structure

## Why

- developers can quickly find what they are looking for in the code
- avoid code duplication
- it makes it easier to work on a part of the project without knowing the other parts
- the project onboarding of a new developer can be done by presenting the `/features` directory

## Key points

```
Dans le dossier /src :
api ===> we use codegen (automatic API call functions generation)

features
  \
    |- login
      \
        |- api
          \
            |- user
              \
                |- login.ts ===> caller, adapter
                |- otherCall.ts
        |- components ==> composants UI spécifiques à la fonctionalité
          \
            |- Component1.tsx
            |- Component1.test.tsx
            |- ...
        |- pages ==> pages spécifiques à la fonctionalité
        |- services ==> utilitaires ou transformation de données
    |- register
    |- homepage
    |- search

libs
  \
    |- analytics
    |- pushNotification
    |- errorReporting
    |- geolocation
    |- ...

ui
\
 |- components ===> composants 'indépendants'
 |- theme
 |- assets
```

## Mistakes to avoid

- Do not put component into `ui/components` if it is used only once in the app
