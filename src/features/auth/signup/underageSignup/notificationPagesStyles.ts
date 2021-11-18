import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'

export const StyledSubtitle = styled(Typo.Title4)({
  textAlign: 'center',
})

export const Text = styled(Typo.Body)({
  textAlign: 'center',
})

export const ProgressBarContainer = styled.View({
  paddingHorizontal: getSpacing(10),
})

export const Amount = styled(Typo.Title2)({
  textAlign: 'center',
})

export const ButtonContainer = styled.View({
  alignItems: 'center',
})
