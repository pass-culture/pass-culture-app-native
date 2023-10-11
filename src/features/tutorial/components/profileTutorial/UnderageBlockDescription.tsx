import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export const UnderageBlockDescription: () => React.ReactElement = () => {
  const { isLoggedIn, user } = useAuthContext()
  const items = isLoggedIn && user?.isBeneficiary ? [defaultItems[1]] : defaultItems

  return (
    <React.Fragment>
      <CreditProgressBar progress={0.5} />
      <Spacer.Column numberOfSpaces={4} />
      <AccessibilityList Separator={<Spacer.Column numberOfSpaces={4} />} items={items} />
    </React.Fragment>
  )
}

const ItemContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledCaption = styled(Typo.Caption)({
  flexShrink: 1,
})

const IconContainer = styled.View(({ theme }) => ({
  marginRight: getSpacing(2),
  width: theme.icons.sizes.extraSmall,
  height: theme.icons.sizes.extraSmall,
}))

const SmallLock = styled(BicolorLock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const SmallClock = styled(BicolorClock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const defaultItems = [
  <ItemContainer key={1}>
    <IconContainer>
      <SmallLock />
    </IconContainer>
    <StyledCaption>Tu as 1 an pour activer ton crédit.</StyledCaption>
  </ItemContainer>,
  <ItemContainer key={2}>
    <IconContainer>
      <SmallClock />
    </IconContainer>
    <StyledCaption>
      Après activation, tu peux dépenser ton crédit jusqu’à la veille de tes 18 ans.
    </StyledCaption>
  </ItemContainer>,
]
