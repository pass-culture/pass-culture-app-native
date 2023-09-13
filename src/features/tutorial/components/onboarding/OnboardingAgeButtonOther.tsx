import React, { FunctionComponent } from 'react'

import { AgeButton } from 'features/tutorial/components/AgeButton'
import { AgeButtonProps, TutorialType } from 'features/tutorial/types'

interface Props extends AgeButtonProps, TutorialType {}

export const OnboardingAgeButtonOther: FunctionComponent<Props> = (props) => (
  <AgeButton {...props} />
)
