import React, { FunctionComponent } from 'react'

import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { BicolorUserError } from 'ui/svg/BicolorUserError'
import { LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
  children?: never
}

export const ErrorApplicationModal: FunctionComponent<Props> = ({ visible, hideModal }) => {
  return (
    <AppModalWithIllustration
      visible={visible}
      title={`Tu n’as pas encore obtenu ${LINE_BREAK} ton crédit`}
      Illustration={BicolorUserError}
      hideModal={hideModal}
    />
  )
}
