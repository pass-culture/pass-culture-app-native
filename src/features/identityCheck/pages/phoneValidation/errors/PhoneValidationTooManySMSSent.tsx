import React from 'react'
import styled from 'styled-components/native'

import { usePhoneValidationRemainingAttemptsQuery } from 'features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { timeDiffInHours } from 'libs/dates'
import { plural } from 'libs/plural'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Typo } from 'ui/theme'

export function PhoneValidationTooManySMSSent() {
  const { counterResetDatetime } = usePhoneValidationRemainingAttemptsQuery()

  const hoursUntilAllowedRetry = Math.max(0, timeDiffInHours(counterResetDatetime ?? new Date()))

  const hoursLeftWording = plural(hoursUntilAllowedRetry, {
    singular: 'Tu pourras réessayer dans # heure.',
    plural: 'Tu pourras réessayer dans # heures.',
  })

  return (
    <GenericInfoPage
      illustration={UserBlocked}
      title="Réessaie plus tard"
      subtitle="Tu as dépassé le nombre de 5 demandes de code autorisées."
      buttonPrimary={{
        wording: 'Retourner à l’accueil',
        navigateTo: navigateToHomeConfig,
      }}
      buttonTertiary={{
        wording: 'J’ai reçu mon code',
        navigateTo: { screen: 'SetPhoneValidationCode' },
        icon: PlainArrowPrevious,
      }}>
      <StyledBody>{hoursLeftWording}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
