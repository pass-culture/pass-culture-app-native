## How to add a new French translation key

- in your component, add the following code :

```
import { t } from '@lingui/macro';
import { i18n } from 'path/to/lib/i18n';
export const MyComponent = () => (
  <View>
    <Text>
      i18n._(
        /*i18n: Here goes the description for the translator*/ t`The English translation`
      )
    </Text>
  </View>
)
```

- run `yarn translations:extract`
- add the French translation in the `src/locales/fr/messages.po` file
- run `yarn translations:compile`
