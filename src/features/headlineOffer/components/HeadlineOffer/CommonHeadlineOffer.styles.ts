import styled from 'styled-components/native'

import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { Typo } from 'ui/theme'

export const LightGreyText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyMedium,
}))

export const Title = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.colors.white,
}))

export const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.white,
}))({})
