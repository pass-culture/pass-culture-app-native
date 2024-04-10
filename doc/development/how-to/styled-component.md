# Le styled-components

## Exemples simples

```tsx
import React from 'react'
import { CustomFooter } from './CustomFooter'
import styled from 'styled-components/native'

// React component
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
