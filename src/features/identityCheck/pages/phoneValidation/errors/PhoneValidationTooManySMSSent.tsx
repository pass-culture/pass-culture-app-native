import React from 'react'
import styled from 'styled-components/native'

import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/api'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { timeDiffInHours } from 'libs/dates'
import { plural } from 'libs/plural'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Spacer, Typo } from 'ui/theme'

export function PhoneValidationTooManySMSSent() {
  const { counterResetDatetime } = usePhoneValidationRemainingAttempts()

  const hoursUntilAllowedRetry = Math.max(0, timeDiffInHours(counterResetDatetime ?? new Date()))

  const hoursLeftWording = plural(hoursUntilAllowedRetry, {
    one: 'Tu pourras réessayer dans # heure.',
    other: 'Tu pourras réessayer dans # heures.',
  })

  return (
    <GenericInfoPage
      title="Réessaie plus tard"
      icon={UserBlocked}
      buttons={[
        <InternalTouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={navigateToHomeConfig}
        />,
        <InternalTouchableLink
          key={2}
          as={ButtonTertiaryWhite}
          icon={PlainArrowPrevious}
          wording="J’ai reçu mon code"
          navigateTo={{ screen: 'SetPhoneValidationCode' }}
        />,
      ]}>
      <StyledBody>Tu as dépassé le nombre de 5 demandes de code autorisées.</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <StyledBody>{hoursLeftWording}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
