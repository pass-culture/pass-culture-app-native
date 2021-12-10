import styled from 'styled-components/native'

import { getSpacing, padding } from 'ui/theme'

export const CardContent = styled.View({
  width: '100%',
  alignItems: 'center',
})

export const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})

export const EmailSentModalContent = styled.View({
  ...padding(4, 1),
  alignItems: 'center',
  width: '100%',
  maxWidth: getSpacing(125),
})

export const Description = styled.View({
  alignItems: 'center',
})

export const CenteredText = styled.Text({
  textAlign: 'center',
})
