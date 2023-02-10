import React from 'react'

import { contactSupport } from 'features/auth/helpers/__mocks__/contactSupport'
import { computePrimaryButtonToDisplay } from 'features/identityCheck/pages/identification/errors/eduConnect/helpers/computePrimaryButtonToDisplay'
import { navigateToHomeConfig } from 'features/navigation/helpers/__mocks__'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Email } from 'ui/svg/icons/Email'

describe('computePrimaryButtonToDisplay', () => {
  const defaultPrimaryButton = (
    <InternalTouchableLink
      key={1}
      as={ButtonPrimaryWhite}
      wording="Retourner à l’accueil"
      navigateTo={navigateToHomeConfig}
    />
  )

  const navigateToButtonProps = {
    text: 'Réessayer de m’identifier',
    navigateTo: { screen: 'IdentityCheckEduConnectForm' },
  }

  const navigateToPrimaryButton = (
    <InternalTouchableLink
      key={1}
      as={ButtonPrimaryWhite}
      wording="Réessayer de m’identifier"
      navigateTo={{ screen: 'IdentityCheckEduConnectForm' }}
    />
  )

  const externalNavPrimaryButton = (
    <ExternalTouchableLink
      key={1}
      as={ButtonPrimaryWhite}
      wording="Contacter le support"
      icon={Email}
      externalNav={contactSupport.forGenericQuestion}
    />
  )

  const externalNavButtonProps = {
    text: 'Contacter le support',
    icon: Email,
    externalNav: contactSupport.forGenericQuestion,
  }

  it.each`
    buttonProps               | expectedButton
    ${undefined}              | ${defaultPrimaryButton}
    ${navigateToButtonProps}  | ${navigateToPrimaryButton}
    ${externalNavButtonProps} | ${externalNavPrimaryButton}
  `(
    'should return the correct button depending on the given button props',
    ({ buttonProps, expectedButton }) => {
      const primaryButton = computePrimaryButtonToDisplay({ button: buttonProps })

      expect(primaryButton).toEqual(expectedButton)
    }
  )
})
