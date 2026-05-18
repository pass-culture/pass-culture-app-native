import styled from 'styled-components/native'

import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { Typo } from 'ui/theme'

export const LightGreyText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

export const Title = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

export const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.m,
  color: theme.designSystem.color.icon.lockedInverted,
}))({})
