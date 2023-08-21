import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

interface Props {
  age: number
  userAge: number
  deposit: string
}

export const CreditBlockTitle = ({ age, userAge, deposit }: Props): React.ReactElement => {
  const TitleText: React.JSXElementConstructor<{ children: string }> =
    age === userAge ? TitleSecondary : Typo.ButtonText

  if (age > userAge) {
    return <TitleText>{`+ ${deposit}`}</TitleText>
  }
  return <TitleText>{deposit}</TitleText>
}

const Title = styled(Typo.Title3).attrs(getNoHeadingAttrs)``

const TitleSecondary = styled(Title)(({ theme }) => ({
  color: theme.colors.secondary,
}))
