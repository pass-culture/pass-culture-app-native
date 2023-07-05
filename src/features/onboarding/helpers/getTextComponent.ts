import { ComponentType } from 'react'
import styled from 'styled-components/native'

import { CreditStatus } from 'features/onboarding/types'
import { Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const getTitleComponent = (underage: boolean, creditStatus: CreditStatus): ComponentType => {
  switch (creditStatus) {
    case CreditStatus.ONGOING:
      return TitleSecondary
    case CreditStatus.GONE:
      return underage ? Typo.ButtonTextNeutralInfo : TitleNeutralInfo
    case CreditStatus.COMING:
    default:
      return underage ? Typo.ButtonText : Title
  }
}

export const getAgeComponent = (underage: boolean, creditStatus: CreditStatus): ComponentType => {
  switch (creditStatus) {
    case CreditStatus.ONGOING:
      return BodySecondary
    case CreditStatus.GONE:
      return underage ? Typo.CaptionNeutralInfo : BodyNeutralInfo
    case CreditStatus.COMING:
    default:
      return underage ? Typo.Caption : Typo.Body
  }
}

const Title = styled(Typo.Title3).attrs(getNoHeadingAttrs)``

const TitleSecondary = styled(Title)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const TitleNeutralInfo = styled(Title)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const BodySecondary = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const BodyNeutralInfo = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
