## How to translate

It's easy as follows:

```tsx
import { Text, View } from 'react-native'
import { t } from '@lingui/macro'

function HelloWorld({ name: string }) {
  return (
    <View>
      <Text>{t(`Hello World`)}</Text>
    </View>
  )
}
```

## v3 migration note

V3 brings the `plural` into our application, but it also brings two new non blocking bugs :

1. Test unit doesn't exist properly : https://github.com/lingui/js-lingui/issues/1041
2. Translation may be empty in `development` and show a warning : https://github.com/lingui/js-lingui/issues/1042

To solve (2), prefer the parameterised syntax.

### v2 to v3 syntax changes

V2 syntax:

```jsx
_(t(`text`))
```

V3 use macro, you don't need `_` anymore:

```jsx
t(`text`)
```

**Unicode chars are trimmed**

Left and right of your translation is trimmed in v3, it is not possible to write:

```jsx
t`\u00a0EAN\u00a0`
```

Instead, use:

```jsx
'\u00a0' + t`EAN` + '\u00a0'
```

You don't need to add date formatting in the translation, do not write:

```jsx
t`À retirer avant le\u00a0${formatToCompleteFrenchDate(expirationDatetime, false)}`
```

Instead, write the translation and concatenate the non translated text:

```jsx
t`À retirer avant le` + `\u00a0${formatToCompleteFrenchDate(expirationDatetime, false)}`
```

You can also use the parameterised syntax.
