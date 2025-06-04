import React from 'react'
import styled from 'styled-components/native'

import { EligibilityType } from 'api/gen'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Offers } from 'ui/svg/icons/Offers'
import { Typo } from 'ui/theme'

export const EmptyCredit = ({
  age,
  eligibility,
}: {
  age: number
  eligibility?: EligibilityType | null
}) => {
  const { homeEntryIdFreeOffers } = useRemoteConfigQuery()
  const { sixteenYearsOldDeposit, seventeenYearsOldDeposit, eighteenYearsOldDeposit } =
    useDepositAmountsByAge()

  const incomingCreditMap: Record<number, string> = {
    15: sixteenYearsOldDeposit,
    16: seventeenYearsOldDeposit,
    17: eighteenYearsOldDeposit,
  }

  if (!incomingCreditMap[age]) return null

  const ageToShowCreditV3 = age === 17 ? 17 : 16

  const isUserFreeStatus = eligibility === EligibilityType.free
  const nextCreditIntroText = isUserFreeStatus
    ? 'Tu pourras débloquer ton prochain crédit de '
    : 'Ton prochain crédit de '
  const nextCreditTimingText = isUserFreeStatus ? ' à ' : ' sera débloqué à '

  return (
    <ViewGap gap={4}>
      <Typo.Body>
        {nextCreditIntroText}
        <HighlightedBody>{incomingCreditMap[ageToShowCreditV3]}</HighlightedBody>
        {nextCreditTimingText}
        {ageToShowCreditV3 + 1} ans. En attendant…
      </Typo.Body>
      <InternalTouchableLink
        as={ButtonPrimary}
        wording="Profite d’offres gratuites"
        navigateTo={{
          screen: 'ThematicHome',
          params: { homeId: homeEntryIdFreeOffers, from: 'profile' },
        }}
        icon={WhiteOffers}
      />
    </ViewGap>
  )
}

const HighlightedBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const WhiteOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.colors.white,
}))``
