import React from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

interface Props {
  age: number
  userAge: number
  deposit: string
}

export const ProfileTutorialCreditBlockTitle = ({
  age,
  userAge,
  deposit,
}: Props): React.ReactElement => {
  if (age === 18) {
    return (
      <StyledButtonText>
        Tu reçois <ButtonTextSecondary>{deposit}</ButtonTextSecondary>
      </StyledButtonText>
    )
  }
  if (age === userAge) {
    return <TitleSecondary>{`Tu reçois ${deposit}`}</TitleSecondary>
  }

  if (age > userAge) {
    return (
      <StyledButtonText>
        Tu reçois <ButtonTextSecondary>{deposit}</ButtonTextSecondary> supplémentaires
      </StyledButtonText>
    )
  }
  return <StyledButtonText>{deposit}</StyledButtonText>
}

const TitleSecondary = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.colors.secondary,
  marginBottom: getSpacing(2),
}))

const StyledButtonText = styled(Typo.ButtonText)({
  marginBottom: getSpacing(2),
})

const ButtonTextSecondary = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.secondary,
}))
