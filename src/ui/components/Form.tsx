import styled from 'styled-components/native'

const MaxWidth = styled.View<{
  flex?: number
}>(({ theme, flex }) => ({
  width: '100%',
  maxWidth: theme.forms.maxWidth,
  flex,
}))

const Flex = styled.View({
  flex: 1,
})

export const Form = {
  Flex,
  MaxWidth,
}
