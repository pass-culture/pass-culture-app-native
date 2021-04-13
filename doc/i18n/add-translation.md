## How to add a new French translation key

In your component, add the following code:

```tsx
import { Text, View } from 'react-native'
import { t } from '@lingui/macro'

export const MyComponent = () => (
  <View>
    <Text>
      t`The English translation`
    </Text>
  </View>
)
```

- run `yarn translations:extract`
- add the French translation in the `src/locales/fr/messages.po` file
- run `yarn translations:compile`
