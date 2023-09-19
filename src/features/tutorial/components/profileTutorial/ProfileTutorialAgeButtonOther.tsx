import React, { FunctionComponent } from 'react'

import { AgeButtonContainer } from 'features/tutorial/components/AgeButtonContainer'
import { ProfileTutorialAgeButtonOtherProps, TutorialType } from 'features/tutorial/types'
import { Touchable } from 'ui/components/touchable/Touchable'

interface Props extends ProfileTutorialAgeButtonOtherProps, TutorialType {}

export const ProfileTutorialAgeButtonOther: FunctionComponent<Props> = ({
  onPress,
  accessibilityLabel,
  children,
}) => (
  <Touchable onPress={onPress} accessibilityLabel={accessibilityLabel}>
    <AgeButtonContainer>{children}</AgeButtonContainer>
  </Touchable>
)
