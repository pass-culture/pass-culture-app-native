import styled from 'styled-components'

const MaxWidth = styled.form(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
}))

const Flex = styled.form({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
})

export const Form = { Flex, MaxWidth }
