## Code structure

### Why

- the code structure follows a screaming architecture
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
            |- __mocks__
            |- login.ts ===> caller, adapter
            |- login.test.ts
            |- otherCall.ts
            |- otherCall.test.ts
            |- index.ts => optional, exports methods explicitly
        |- components ==> feature-specific UI components
          \
            |- Component1.tsx
            |- Component1.test.tsx
            |- Component1.stories.tsx
            |- ...
        |- pages ==> feature-specific pages
          \
            |- Page1.tsx
            |- Page1.test.tsx
            |- ...
        |- helpers ==> utils or data transform functions
          \
              |- helper1.tsx
              |- helper1.test.tsx
              |- helper2.tsx
              |- helper2.test.tsx
              |- index.ts => optional, exports methods explicitly
        |- fixtures
          \
            |- fixture1.ts ==> data for testing (for example API call responses mocks)
            |- ...
        |- context ==> feature context related files (provider, reducer, etc)
        |- enums.ts
        |- types.ts
    |- register
    |- homepage
    |- search

libs ===> external modules implementations or reusable helpers
  \
    |- analytics
    |- pushNotification
    |- errorReporting
    |- geolocation
    |- ...

theme ==> theme object used in styled-components

ui
  \
    |- animations ==> lottie animations
    |- components ===> independent and stateless components (reusables)
      \
        |- Component1.tsx
        |- Component1.test.tsx
        |- Component1.stories.tsx
        |- ...
    |- hooks
    |- svg ==> logos and icons
    |- styleGuide ==> theme constants and typography components
```


### Guidelines

- Do not put component into `ui/components` if it is used only once in the app, put it in the feature that uses it
- Put stories and tests next to corresponding page or component in dedicated subdirectory


### Resources

- ADR: https://www.notion.so/ADR-sur-la-structure-du-projet-315ca5b83d134d938074855b509f611a
