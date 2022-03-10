import styled from 'styled-components/native'

export const ContainerWithMaxWidth = styled.View(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))
