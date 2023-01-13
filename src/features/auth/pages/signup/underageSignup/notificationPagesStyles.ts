import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const StyledSubtitle = styled(Typo.Title4).attrs(getNoHeadingAttrs())({
  textAlign: 'center',
})

export const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

export const ProgressBarContainer = styled.View({
  paddingHorizontal: getSpacing(10),
})

export const Amount = styled(Typo.Title2).attrs(getNoHeadingAttrs())(({ theme }) => ({
  textAlign: 'center',
  color: theme.uniqueColors.brand,
}))

export const ButtonContainer = styled.View({
  alignItems: 'center',
})
