import React from 'react'

import { NotEligibleEduConnectErrorData } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'

export const computePrimaryButtonToDisplay = ({
  button,
}: {
  button?: NotEligibleEduConnectErrorData['primaryButton']
}): React.ReactNode => {
  if (!button) {
    return (
      <InternalTouchableLink
        key={1}
        as={ButtonPrimaryWhite}
        wording="Retourner à l’accueil"
        navigateTo={navigateToHomeConfig}
      />
    )
  }

  const { text: primaryButtonText, icon: primaryButtonIcon, onPress: onPrimaryButtonPress } = button

  // If button props are given + a navigateTo prop is defined :
  // 'navigateTo' in button => 'navigateTo' key exists in the button object
  // button.navigateTo => 'navigateTo' value is not null nor undefined
  if ('navigateTo' in button && button.navigateTo) {
    return (
      <InternalTouchableLink
        key={1}
        as={ButtonPrimaryWhite}
        wording={primaryButtonText}
        navigateTo={button.navigateTo}
        icon={primaryButtonIcon}
        onBeforeNavigate={onPrimaryButtonPress}
      />
    )
  }

  if ('externalNav' in button && button.externalNav) {
    return (
      <ExternalTouchableLink
        key={1}
        as={ButtonPrimaryWhite}
        wording={primaryButtonText}
        icon={primaryButtonIcon}
        onBeforeNavigate={onPrimaryButtonPress}
        externalNav={button.externalNav}
      />
    )
  }

  return null
}
