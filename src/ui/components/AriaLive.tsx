import React, { ReactNode } from 'react'

import { HiddenText } from 'ui/components/HiddenText'

type Props = {
  liveType?: string
  children: ReactNode
}

export const AriaLive = (props: Props) => {
  return <HiddenText>{props.children}</HiddenText>
}
