import React, { ReactNode } from 'react'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

type Props = {
  children: ReactNode
}

export const CguDetails: React.FC<Props> = ({ children }) => {
  return (
    <ViewGap gap={4}>
      <Typo.Title4 {...getTextSemanticAttrs(2)}>Conditions d’utilisation</Typo.Title4>
      {children}
    </ViewGap>
  )
}
