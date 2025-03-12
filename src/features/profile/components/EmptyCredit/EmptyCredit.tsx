import React from 'react'
import styled from 'styled-components/native'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Offers } from 'ui/svg/icons/Offers'
import { Spacer, TypoDS } from 'ui/theme'

export const EmptyCredit = ({ age }: { age: number }) => {
  const { homeEntryIdFreeOffers } = useRemoteConfigQuery()
  const { sixteenYearsOldDeposit, seventeenYearsOldDeposit, eighteenYearsOldDeposit } =
    useDepositAmountsByAge()

  const { data: settings } = useSettingsContext()
  const enableCreditV3 = settings?.wipEnableCreditV3

  const incomingCreditMap: Record<number, string> = {
    15: sixteenYearsOldDeposit,
    16: seventeenYearsOldDeposit,
    17: eighteenYearsOldDeposit,
  }

  if (!incomingCreditMap[age]) return null

  const ageToShowCreditV3 = age === 17 ? 17 : 16
  return (
    <React.Fragment>
      {enableCreditV3 ? (
        <TypoDS.Body>
          Ton prochain crédit de{' '}
          <HighlightedBody>{incomingCreditMap[ageToShowCreditV3]}</HighlightedBody> sera débloqué à{' '}
          {ageToShowCreditV3 + 1} ans. En attendant…
        </TypoDS.Body>
      ) : (
        <TypoDS.Body>
          Ton prochain crédit de <HighlightedBody>{incomingCreditMap[age]}</HighlightedBody> sera
          débloqué à {age + 1} ans. En attendant…
        </TypoDS.Body>
      )}
      <Spacer.Column numberOfSpaces={4} />
      <InternalTouchableLink
        as={ButtonWithLinearGradient}
        wording="Profite d’offres gratuites"
        navigateTo={{
          screen: 'ThematicHome',
          params: { homeId: homeEntryIdFreeOffers, from: 'profile' },
        }}
        icon={WhiteOffers}
      />
    </React.Fragment>
  )
}

const HighlightedBody = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const WhiteOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.colors.white,
}))``
