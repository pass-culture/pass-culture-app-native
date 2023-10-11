import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { BlockDescriptionItem } from 'features/tutorial/components/profileTutorial/BlockDescriptionItem'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { Spacer } from 'ui/theme'

export const UnderageBlockDescription: () => React.ReactElement = () => {
  const { isLoggedIn, user } = useAuthContext()
  const items = isLoggedIn && isUserUnderageBeneficiary(user) ? [defaultItems[1]] : defaultItems

  return (
    <React.Fragment>
      <CreditProgressBar progress={0.5} />
      <Spacer.Column numberOfSpaces={4} />
      <AccessibilityList Separator={<Spacer.Column numberOfSpaces={4} />} items={items} />
    </React.Fragment>
  )
}

const SmallLock = styled(BicolorLock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const SmallClock = styled(BicolorClock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const defaultItems = [
  <BlockDescriptionItem key={1} icon={<SmallLock />} text="Tu as 1 an pour activer ton crédit." />,
  <BlockDescriptionItem
    key={2}
    icon={<SmallClock />}
    text="Après activation, tu peux dépenser ton crédit jusqu’à la veille de tes 18 ans."
  />,
]
