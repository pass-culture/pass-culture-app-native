import styled from 'styled-components/native'

export const BottomCardContentContainer = styled.View(({ theme }) => ({
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))
