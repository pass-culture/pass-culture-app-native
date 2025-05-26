import styled from 'styled-components/native'

const MaxWidth = styled.View<{
  flex?: number
  marginTop?: number
}>(({ theme, flex, marginTop }) => ({
  width: '100%',
  maxWidth: theme.forms.maxWidth,
  flex,
  marginTop,
}))

const Flex = styled.View({
  flex: 1,
})

export const Form = {
  Flex,
  MaxWidth,
}
