import React from 'react'
import styled from 'styled-components/native'

import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Offers } from 'ui/svg/icons/Offers'
import { Spacer, Typo } from 'ui/theme'

export const EmptyCredit = ({ age }: { age: number }) => {
  const { homeEntryIdFreeOffers } = useRemoteConfigContext()
  const { sixteenYearsOldDeposit, seventeenYearsOldDeposit, eighteenYearsOldDeposit } =
    useDepositAmountsByAge()

  const incomingCreditMap: Record<number, string> = {
    15: sixteenYearsOldDeposit,
    16: seventeenYearsOldDeposit,
    17: eighteenYearsOldDeposit,
  }

  if (!incomingCreditMap[age]) return null

  return (
    <React.Fragment>
      <Typo.Body>
        Ton prochain crédit de <HighlightedBody>{incomingCreditMap[age]}</HighlightedBody> sera
        débloqué à {age + 1} ans. En attendant…
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <InternalTouchableLink
        as={ButtonWithLinearGradient}
        wording="Profite d’offres gratuites"
        navigateTo={{
          screen: 'ThematicHome',
          params: { homeId: homeEntryIdFreeOffers, from: 'EmptyCredit' },
        }}
        icon={WhiteOffers}
      />
    </React.Fragment>
  )
}

const HighlightedBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const WhiteOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.colors.white,
}))``
