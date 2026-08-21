import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

interface Props {
  age: number
  userAge: number
  deposit: string
}

export const OnboardingCreditBlockTitle = ({
  age,
  userAge,
  deposit,
}: Props): React.ReactElement => {
  const TitleText: React.JSXElementConstructor<{ children: string }> =
    age === userAge ? TitleSecondary : Typo.BodyAccent

  if (age !== 18 && age > userAge) {
    return <TitleText>{`+ ${deposit}`}</TitleText>
  }
  return <TitleText>{deposit}</TitleText>
}

const TitleSecondary = styled(Typo.Title3).attrs(setTextSemantic('p'))(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))
