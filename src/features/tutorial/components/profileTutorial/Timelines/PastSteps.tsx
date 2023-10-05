import React from 'react'
import styled from 'styled-components/native'

import { CreditComponentProps } from 'features/tutorial/components/CreditTimeline'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { Spacer, Typo, getSpacing } from 'ui/theme'

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

type Underage = 15 | 16 | 17

export const pastStep = (age: Underage, deposit: string): CreditComponentProps => ({
  creditStep: 'pastStep',
  children: <PastStepBlock text={`Tu as reçu ${deposit} à ${age}\u00a0ans`} />,
  iconComponent: <GreyUnlock />,
})

export const PastStepBlock = ({ text }: { text: string }) => {
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={3} />
      <StyledCaption>{text}</StyledCaption>
      <Spacer.Column numberOfSpaces={1} />
    </React.Fragment>
  )
}

const GreyUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  color2: theme.colors.greySemiDark,
  size: theme.icons.sizes.smaller,
}))({
  marginHorizontal: getSpacing(1.5),
})
