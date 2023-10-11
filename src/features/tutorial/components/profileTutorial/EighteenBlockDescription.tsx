import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { isUserBeneficiary18 } from 'features/profile/helpers/isUserBeneficiary18'
import { BlockDescriptionItem } from 'features/tutorial/components/profileTutorial/BlockDescriptionItem'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { BicolorNumeric } from 'ui/svg/icons/bicolor/Numeric'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  ongoingCredit?: boolean
}

export const EighteenBlockDescription: FunctionComponent<Props> = ({ ongoingCredit = false }) => {
  const { isLoggedIn, user } = useAuthContext()

  const defaultItems = [
    <BlockDescriptionItem
      key={1}
      icon={<SmallLock bicolor={ongoingCredit} />}
      text="Tu as 1 an pour confirmer ton identité et activer ce crédit."
    />,
    <BlockDescriptionItem
      key={2}
      icon={<SmallClock bicolor={ongoingCredit} />}
      text="Après activation, tu as 2 ans pour dépenser ton crédit."
    />,
    <BlockDescriptionItem
      key={3}
      icon={<SmallNumeric bicolor={ongoingCredit} />}
      text="La limite de 100&nbsp;€ est là pour t’encourager à tester des offres culturelles variées."
    />,
  ]
  const items =
    isLoggedIn && user && isUserBeneficiary18(user) ? defaultItems.slice(1) : defaultItems

  return (
    <React.Fragment>
      <CreditProgressBar progress={1} />
      <Spacer.Column numberOfSpaces={2} />
      <StyledCaption>
        dont 100&nbsp;€ en offres numériques (streaming, presse en ligne, …)
      </StyledCaption>
      <Spacer.Column numberOfSpaces={4} />
      <AccessibilityList Separator={<Spacer.Column numberOfSpaces={4} />} items={items} />
    </React.Fragment>
  )
}

const StyledCaption = styled(Typo.Caption)({
  flexShrink: 1,
})

const SmallLock = styled(BicolorLock).attrs(({ theme, bicolor }) => ({
  size: theme.icons.sizes.extraSmall,
  color: bicolor ? theme.colors.primary : theme.colors.greySemiDark,
  color2: bicolor ? theme.colors.secondary : theme.colors.greySemiDark,
}))``

const SmallClock = styled(BicolorClock).attrs(({ theme, bicolor }) => ({
  size: theme.icons.sizes.extraSmall,
  color: bicolor ? theme.colors.primary : theme.colors.greySemiDark,
  color2: bicolor ? theme.colors.secondary : theme.colors.greySemiDark,
}))``

const SmallNumeric = styled(BicolorNumeric).attrs(({ theme, bicolor }) => ({
  size: theme.icons.sizes.extraSmall,
  color: bicolor ? theme.colors.primary : theme.colors.greySemiDark,
  color2: bicolor ? theme.colors.secondary : theme.colors.greySemiDark,
}))``
