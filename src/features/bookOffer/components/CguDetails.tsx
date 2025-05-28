import React, { ReactNode } from 'react'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  children: ReactNode
}

export const CguDetails: React.FC<Props> = ({ children }) => {
  return (
    <ViewGap gap={4}>
      <Typo.Title4 {...getHeadingAttrs(2)}>Conditions d’utilisation</Typo.Title4>
      {children}
    </ViewGap>
  )
}
