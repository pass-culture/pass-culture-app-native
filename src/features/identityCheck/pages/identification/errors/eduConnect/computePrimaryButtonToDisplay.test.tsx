import React from 'react'

import { contactSupport } from 'features/auth/__mocks__/support.services'
import { computePrimaryButtonToDisplay } from 'features/identityCheck/pages/identification/errors/eduConnect/computePrimaryButtonToDisplay'
import { navigateToHomeConfig } from 'features/navigation/helpers/__mocks__'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Email } from 'ui/svg/icons/Email'

describe('computePrimaryButtonToDisplay', () => {
  const defaultPrimaryButton = (
    <TouchableLink
      key={1}
      as={ButtonPrimaryWhite}
      wording="Retourner à l'accueil"
      navigateTo={navigateToHomeConfig}
    />
  )

  const navigateToButtonProps = {
    text: 'Réessayer de m’identifier',
    navigateTo: { screen: 'IdentityCheckEduConnectForm' },
  }

  const navigateToPrimaryButton = (
    <TouchableLink
      key={1}
      as={ButtonPrimaryWhite}
      wording="Réessayer de m’identifier"
      navigateTo={{ screen: 'IdentityCheckEduConnectForm' }}
    />
  )

  const externalNavPrimaryButton = (
    <TouchableLink
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
