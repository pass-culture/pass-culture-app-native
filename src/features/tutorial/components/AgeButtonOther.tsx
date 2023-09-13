import React, { FunctionComponent } from 'react'

import { AgeButton } from 'features/tutorial/components/AgeButton'
import { AgeButtonContainer } from 'features/tutorial/components/AgeButtonContainer'
import { TutorialTypes } from 'features/tutorial/enums'
import { AgeButtonProps, TutorialType } from 'features/tutorial/types'
import { Touchable } from 'ui/components/touchable/Touchable'

interface Props extends AgeButtonProps, TutorialType {}

export const AgeButtonOther: FunctionComponent<Props> = (props) => {
  if (props.type === TutorialTypes.PROFILE_TUTORIAL) {
    return (
      <Touchable onPress={props.onPress} accessibilityLabel={props.accessibilityLabel}>
        <AgeButtonContainer dense={props.dense} LeftIcon={props.icon}>
          {props.children}
        </AgeButtonContainer>
      </Touchable>
    )
  }

  return <AgeButton {...props} />
}
