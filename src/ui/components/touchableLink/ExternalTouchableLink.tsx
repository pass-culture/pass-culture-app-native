import React, { FunctionComponent } from 'react'

import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { TouchableLinkProps } from 'ui/components/touchableLink/types'

type Props = TouchableLinkProps

export const ExternalTouchableLink: FunctionComponent<Props> = (props) => {
  return <TouchableLink {...props} />
}
