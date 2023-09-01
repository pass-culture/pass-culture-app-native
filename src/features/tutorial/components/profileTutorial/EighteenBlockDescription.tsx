import React from 'react'
import styled from 'styled-components/native'

import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { Numeric } from 'ui/svg/icons/bicolor/Numeric'
import { Clock } from 'ui/svg/icons/BicolorClock'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { Spacer, Typo } from 'ui/theme'

export const EighteenBlockDescription: () => React.ReactElement = () => {
  return (
    <React.Fragment>
      <CreditProgressBar progress={1} />
      <Spacer.Column numberOfSpaces={2} />
      <StyledCaption>dont 100€ en offres numériques (streaming, presse en ligne, …)</StyledCaption>
      <Spacer.Column numberOfSpaces={4} />
      <StyledUl>
        <Li>
          <ItemContainer>
            <SmallLock />
            <Spacer.Row numberOfSpaces={2} />
            <StyledCaption>
              Tu as 1 an pour confirmer ton identité et activer ce crédit.
            </StyledCaption>
          </ItemContainer>
        </Li>
        <Spacer.Column numberOfSpaces={4} />
        <Li>
          <ItemContainer>
            <SmallClock />
            <Spacer.Row numberOfSpaces={2} />
            <StyledCaption>Après activation, tu as 2 ans pour dépenser ton crédit.</StyledCaption>
          </ItemContainer>
        </Li>
        <Spacer.Column numberOfSpaces={4} />
        <Li>
          <ItemContainer>
            <SmallNumeric />
            <Spacer.Row numberOfSpaces={2} />
            <StyledCaption>
              La limite de 100€ est là pour t’encourager à tester des offres culturelles variées.
            </StyledCaption>
          </ItemContainer>
        </Li>
      </StyledUl>
    </React.Fragment>
  )
}

const StyledUl = styled(Ul)({
  flexDirection: 'column',
  alignItems: 'flex-start',
})

const StyledCaption = styled(Typo.Caption)({
  flexShrink: 1,
})

const ItemContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
})

const SmallLock = styled(BicolorLock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greySemiDark,
  color2: theme.colors.greySemiDark,
}))``

const SmallClock = styled(Clock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greySemiDark,
}))``

const SmallNumeric = styled(Numeric).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.greySemiDark,
}))``
