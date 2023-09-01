import React from 'react'
import styled from 'styled-components/native'

import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { Li } from 'ui/components/Li'
import { Ul } from 'ui/components/Ul'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { Spacer, Typo } from 'ui/theme'

export const UnderageBlockDescription: () => React.ReactElement = () => {
  return (
    <React.Fragment>
      <CreditProgressBar progress={0.5} />
      <Spacer.Column numberOfSpaces={4} />
      <StyledUl>
        <Li>
          <ItemContainer>
            <SmallLock />
            <Spacer.Row numberOfSpaces={2} />
            <StyledCaption>Tu as 1 an pour activer ton crédit.</StyledCaption>
          </ItemContainer>
        </Li>
        <Spacer.Column numberOfSpaces={4} />
        <Li>
          <ItemContainer>
            <SmallClock />
            <Spacer.Row numberOfSpaces={2} />
            <StyledCaption>
              Après activation, tu peux dépenser ton crédit jusqu’à la veille de tes 18 ans.
            </StyledCaption>
          </ItemContainer>
        </Li>
        <Spacer.Column numberOfSpaces={4} />
      </StyledUl>
    </React.Fragment>
  )
}

const StyledUl = styled(Ul)({
  flexDirection: 'column',
  alignItems: 'flex-start',
})

const ItemContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
})

const StyledCaption = styled(Typo.Caption)({
  flexShrink: 1,
})

const SmallLock = styled(BicolorLock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const SmallClock = styled(BicolorClock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
