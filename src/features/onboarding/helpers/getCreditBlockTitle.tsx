import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const getCreditBlockTitle = ({
  age,
  userAge,
  deposit,
}: {
  age: number
  userAge: number
  deposit: string
}): React.ReactElement => {
  const TitleText: React.JSXElementConstructor<{ children: string }> =
    age === userAge ? TitleSecondary : Typo.ButtonText

  switch (age) {
    case 15:
      return <TitleText>{deposit}</TitleText>
    case 16:
    case 17:
      if (age > userAge) {
        return <TitleText>{`+ ${deposit}`}</TitleText>
      } else {
        return <TitleText>{deposit}</TitleText>
      }
    case 18:
    default:
      return <TitleText>{deposit}</TitleText>
  }
}

const Title = styled(Typo.Title3).attrs(getNoHeadingAttrs)``

const TitleSecondary = styled(Title)(({ theme }) => ({
  color: theme.colors.secondary,
}))
