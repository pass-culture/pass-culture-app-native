## How to add a new language

For example, to add German:

- Add to the `lingui.config.js` file situated in the root directory, a new BCP-47 code in the `locales` array.
- Then, you'll need to load the plurals of that locale, modify this file: `/pass-culture-app-native/src/libs/i18n.ts`

For example (German):

```ts
import { fr, de } from 'make-plural/plurals'

i18n.loadLocaleData({
  fr: { plurals: fr },
  de: { plurals: de },
})
```

- `yarn translations:extract`
