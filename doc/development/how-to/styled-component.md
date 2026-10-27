# Le styled-components

## Exemples simples

On peut décider de modifier directement le style, mais dans certains cas on veut aussi modifier les attributs à l'aide de `.attrs(...)`. Dans certains cas on peut avoir besoin d'utiliser les deux.

Un exemple simple d'utilisation de `.attrs()` est notre façon d'utiliser les icons. Attention à bien fermer la définition du styled component avec \`\` pour que celui-ci fonctionne.

```tsx
const LocationPointerNotFilled = styled(LocationPointer).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.default,
  size: theme.designSystem.size.icon.m,
}))``
```

Dans un composant React, les styled composants sont utilisées de cette manière :

```tsx
import React from 'react'
import styled from 'styled-components/native'

import { CustomFooter } from './CustomFooter'

type Props = { title: string; children: React.ReactNode }

const ReactComponent = ({ title, children }: Props) => (
  <Container>
    <Header>
      <Title>{title}</Title>
    </Header>
    <ContentScrollView>{children}</ContentScrollView>
    <ColoredFooter />
  </Container>
)

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.default,
}))

const Header = styled.View({
  height: 20,
})

const Title = styled.Text({
  fontWeight: 500,
})

const ContentScrollView = styled.ScrollView.attrs(({ theme }) => ({
  // on peut ajouter d'autres props ici
  contentContainerStyle: {
    padding: theme.designSystem.size.spacing.l,
  },
}))(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const ColoredFooter = styled(CustomFooter)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.brandPrimary,
}))
```

Les couleurs et les espacements viennent des tokens du thème (`theme.designSystem`), pas de valeurs en dur.

## Exemples avec des props

```tsx
import React from 'react'
import styled from 'styled-components/native'

const Button = ({ onPress }: { onPress: () => void }) => {
  return <PressableButton small onPress={onPress} />
}

const PressableButton = styled.TouchableOpacity<{ small: boolean }>((props) => ({
  height: props.small ? 100 : 1000,
  width: props.small ? 200 : 2000,
}))

/**
 * On aurait pu aller plus loin
 */
const PressableButtonWithAttrs = styled.TouchableOpacity.attrs<{ small: boolean }>(
  ({ small }) => ({
    activeOpacity: small ? 1 : 0,
    hitSlop: small ? 20 : 200,
  })
)<{ small: boolean }>((props) => ({
  height: props.small ? 100 : 1000,
  width: props.small ? 200 : 2000,
}))
```
