import styled from 'styled-components/native'

export const InputContainer = styled.View(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
}))
