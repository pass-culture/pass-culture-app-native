import React from 'react'
import styled from 'styled-components/native'

import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { Numeric } from 'ui/svg/icons/bicolor/Numeric'
import { Clock } from 'ui/svg/icons/BicolorClock'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const EighteenBlockDescription: () => React.ReactElement = () => {
  return (
    <React.Fragment>
      <CreditProgressBar progress={1} />
      <Spacer.Column numberOfSpaces={2} />
      <StyledCaption>dont 100€ en offres numériques (streaming, presse en ligne, …)</StyledCaption>
      <Spacer.Column numberOfSpaces={4} />
      <AccessibilityList
        Separator={<Spacer.Column numberOfSpaces={4} />}
        items={[
          <ItemContainer key={1}>
            <IconContainer>
              <SmallLock />
            </IconContainer>
            <StyledCaption>
              Tu as 1 an pour confirmer ton identité et activer ce crédit.
            </StyledCaption>
          </ItemContainer>,
          <ItemContainer key={2}>
            <IconContainer>
              <SmallClock />
            </IconContainer>

            <StyledCaption>Après activation, tu as 2 ans pour dépenser ton crédit.</StyledCaption>
          </ItemContainer>,
          <ItemContainer key={3}>
            <IconContainer>
              <SmallNumeric />
            </IconContainer>
            <StyledCaption>
              La limite de 100€ est là pour t’encourager à tester des offres culturelles variées.
            </StyledCaption>
          </ItemContainer>,
        ]}
      />
    </React.Fragment>
  )
}

const StyledCaption = styled(Typo.Caption)({
  flexShrink: 1,
})

const ItemContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 1,
})

const IconContainer = styled.View(({ theme }) => ({
  marginRight: getSpacing(2),
  width: theme.icons.sizes.extraSmall,
  height: theme.icons.sizes.extraSmall,
}))

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
