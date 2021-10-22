## Code structure

### Why

- developers can quickly find what they are looking for in the code
- avoid code duplication
- it makes it easier to work on a part of the project without knowing the other parts
- the project onboarding of a new developer can be done by presenting the `/features` directory

### Key points

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
        |- components ==> UI components specific to the feature
          \
            |- Component1.tsx
            |- Component1.test.tsx
            |- ...
        |- pages ==> feature specific pages
        |- services ==> utils or data tranform functions
        fixturesTests.ts ==> data for testing (API call responses mocks)
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
 |- components ===> independent components (reusables)
 |- theme
 |- assets
```

### Mistakes to avoid

- Do not put component into `ui/components` if it is used only once in the app

### Ressources

- ADR: https://www.notion.so/ADR-sur-la-structure-du-projet-315ca5b83d134d938074855b509f611a
