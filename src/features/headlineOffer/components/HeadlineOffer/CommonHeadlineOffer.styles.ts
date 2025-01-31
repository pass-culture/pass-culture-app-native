import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { TypoDS } from 'ui/theme'

export const InfoContainer = styled(ViewGap)({
  flex: 1,
})

export const LightGreyText = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyMedium,
}))

export const Title = styled(TypoDS.BodyAccent)(({ theme }) => ({
  color: theme.colors.white,
}))

export const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.white,
}))({})
