import React from 'react'
import styled from 'styled-components/native'

import { TypoDS } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

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
    age === userAge ? TitleSecondary : TypoDS.BodyAccent

  if (age !== 18 && age > userAge) {
    return <TitleText>{`+ ${deposit}`}</TitleText>
  }
  return <TitleText>{deposit}</TitleText>
}

const Title = styled(TypoDS.Title3).attrs(getNoHeadingAttrs)``

const TitleSecondary = styled(Title)(({ theme }) => ({
  color: theme.colors.secondary,
}))
