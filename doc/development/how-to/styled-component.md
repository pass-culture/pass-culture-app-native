# Le styled-components

## Exemples simples

On peut décider de modifier directement le style, mais dans certains cas on veut aussi modifier les attributs à l'aide de `.attrs(...)`. Dans certains cas on peut avoir besoin d'utiliser les deux.

Un exemple simple d'utilisation de `.attrs()` est notre façon d'utiliser les icons. Attention à bien fermer la définition du styled component avec \`\` pour que celui-ci fonctionne.

```tsx
const LocationPointerNotFilled = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.colors.black,
  size: theme.icons.sizes.small,
}))``
```

Dans un composant React, les styled composants sont utilisées de cette manière :

```tsx
import React from 'react'
import { CustomFooter } from './CustomFooter'
import styled from 'styled-components/native'

const ReactComponent = () => (
  <Container>
    <Header>
      <Title>{title}</Title>
    </Header>
    <ContentScrollView>{...content}</ContentScrollView>
  </Container>
)

const Container = styled.View({
  flex: 1,
  backgroundColor: 'pink',
})

const Header = styled.View({
  height: 20,
})

const Title = styled.Text({
  fontWeight: 500,
})

const ContentScrollView = styled.ScrollView.attrs({
  // on peut ajouter d'autres props ici
  contentContainerStyle: {
    padding: 20,
  },
})({
  flex: 1,
  backgroundColor: '#123445',
})

const ColoredFooter = styled(CustomFooter)({
  backgroundColor: '#654321',
})
```

## Exemples avec des props

```tsx
import React from 'react'
import styled from 'styled-components/native'

const Button = () => {
  return <PressableButton small={true} onPress={doSomething} />
}

const PressableButton = styled.TouchableOpacity<{ small: boolean }>((props) => ({
  height: props.small ? 100 : 1000,
  width: props.small ? 200 : 2000,
}))

/**
 * On aurait pu aller plus loin
 */
const PressableButton = styled.TouchableOpacity.attrs<{ small: boolean }>((props) => ({
  activeOpacity: small ? 1 : 0,
  hitSlop: small ? 20 : 200,
}))<{ small: boolean }>((props) => ({
  height: props.small ? 100 : 1000,
  width: props.small ? 200 : 2000,
}))
```
