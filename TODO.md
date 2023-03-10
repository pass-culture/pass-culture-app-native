# TODO

## Links

- [PC-16305](https://passculture.atlassian.net/browse/PC-16305)
- [MobTime](https://mobtime.hadrienmp.fr/mob/pass-culture)
- [RPG](https://ensemble-rpg.onrender.com/) `pass-culture`

## Tasks

- [x] Home page
- [x] GenericHome
- [x] ThematicHome
- [x] OfferPartialDescription => adapter en 26x
- [x] OfferHeader
- [x] useSimilarOffer
- [x] Offer Body - Analytics
- [x] Vérifier les test OfferBody.deprecated.native.tsx
- [ ] Home Header
- [ ] tests webs
- [ ] Parallélisation des tests web

---

## Tasks for another US

- [ ] Créer ticket pour uniformiser les tests de OfferBody et OfferBody.deprecated
- [ ] Retirer la lib wait-for-expect
- [ ] ajouter une règle ESLint qui interdir `() => {}` dans les tests et suggères de remplacer par `jest.fn()`
- [ ] revoir les tests de la thematic home ?
  - [ ] la condition `thematicHeader?.type === ThematicHeaderType.Highlight` n'est pas testée
  - [ ] les tests 1 et 2 sont redondants
- [ ] factoriser la logique qui semble dupliquée entre `CookiesConsent`, `ConsentSettings`, `useCookies`

  - faire un context si besoin
  - on pourrait avoir une seule fois la valeur par défaut

    ```js
    {
        marketing: false,
        performance: false,
        customization: false,
    }
    ```

---

dans `CookiesSettings`,
quelle est la source de vérité ?
entre

- les `settingsCookiesChoice` des props
  - dans `CookiesDetails`
    - dans `useCookiesModalContent`
      - dans `CookiesConsent`
        - un `useState`
  - dans `ConsentSettings`
    - un `useState`
- `cookiesConsent` de `useCookies`
  - donc `useState` représentant indirectement le `Storage`

---

`npm install` fonctionne mais affiche ces 2 erreurs

```
**ERROR** Failed to apply patch for package @react-navigation/core at path

    node_modules/@react-navigation/core

    This error was caused because patch-package cannot apply the following patch file:

    patches/@react-navigation+core+6.2.2.patch

    Try removing node_modules and trying again. If that doesn't work, maybe there was
    an accidental change made to the patch file? Try recreating it by manually
    editing the appropriate files and running:

    patch-package @react-navigation/core

    If that doesn't work, then it's a bug in patch-package, so please submit a bug
    report. Thanks!

    https://github.com/ds300/patch-package/issues

**ERROR** Failed to apply patch for package react-native-launch-navigator at path

    node_modules/react-native-launch-navigator

    This error was caused because patch-package cannot apply the following patch file:

    patches/react-native-launch-navigator+1.0.8.patch

    Try removing node_modules and trying again. If that doesn't work, maybe there was
    an accidental change made to the patch file? Try recreating it by manually
    editing the appropriate files and running:

    patch-package react-native-launch-navigator

    If that doesn't work, then it's a bug in patch-package, so please submit a bug
    report. Thanks!

    https://github.com/ds300/patch-package/issues

---
patch-package finished with 2 error(s).
```
