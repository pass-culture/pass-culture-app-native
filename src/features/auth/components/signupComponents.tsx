import styled from 'styled-components/native'

import { padding, Typo } from 'ui/theme'

export const CardContent = styled.View({
  width: '100%',
  alignItems: 'center',
})

export const Paragraphe = styled(Typo.Body)({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})

export const EmailSentModalContent = styled.View(({ theme }) => ({
  ...padding(4, 1),
  alignItems: 'center',
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
}))

export const Description = styled.View({
  alignItems: 'center',
})

export const CenteredText = styled(Typo.Body)({
  textAlign: 'center',
})
