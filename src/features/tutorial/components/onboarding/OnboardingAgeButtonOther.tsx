import React, { FunctionComponent } from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { AgeButton } from 'features/tutorial/components/AgeButton'
import { AgeButtonProps, TutorialType } from 'features/tutorial/types'

interface Props extends Omit<AgeButtonProps, 'navigateTo' | 'enableNavigate'>, TutorialType {}

export const OnboardingAgeButtonOther: FunctionComponent<Props> = (props) => (
  <AgeButton
    {...props}
    navigateTo={navigateToHomeConfig}
    // We disable navigation because we reset the navigation before,
    // but we still want to use a link (not just a button) for accessibility reason
    enableNavigate={false}
  />
)
