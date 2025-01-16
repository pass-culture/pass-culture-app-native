import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { isUserBeneficiary18 } from 'features/profile/helpers/isUserBeneficiary18'
import { BlockDescriptionItem } from 'features/tutorial/components/profileTutorial/BlockDescriptionItem'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { DEFAULT_EIGHTEEN_YEARS_OLD_DIGITAL_AMOUNT } from 'shared/credits/defaultCredits'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { BicolorNumeric } from 'ui/svg/icons/bicolor/Numeric'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { BicolorLock } from 'ui/svg/icons/BicolorLock'
import { Spacer, TypoDS } from 'ui/theme'

type Props = {
  ongoingCredit?: boolean
}

export const EighteenBlockDescription: FunctionComponent<Props> = ({ ongoingCredit = false }) => {
  const { isLoggedIn, user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const digitalCredit = formatCurrencyFromCents(
    DEFAULT_EIGHTEEN_YEARS_OLD_DIGITAL_AMOUNT,
    currency,
    euroToPacificFrancRate
  )

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
      text={`La limite de ${digitalCredit} est là pour t’encourager à tester des offres culturelles variées.`}
    />,
  ]
  const items =
    isLoggedIn && user && isUserBeneficiary18(user) ? defaultItems.slice(1) : defaultItems

  return (
    <React.Fragment>
      <CreditProgressBar progress={1} />
      <Spacer.Column numberOfSpaces={2} />
      <StyledCaption>
        dont {digitalCredit} en offres numériques (streaming, presse en ligne, …)
      </StyledCaption>
      <Spacer.Column numberOfSpaces={4} />
      <AccessibleUnorderedList Separator={<Spacer.Column numberOfSpaces={4} />} items={items} />
    </React.Fragment>
  )
}

const StyledCaption = styled(TypoDS.BodyAccentXs)({
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
