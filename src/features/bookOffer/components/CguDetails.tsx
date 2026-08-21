import React, { ReactNode } from 'react'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type Props = {
  children: ReactNode
}

export const CguDetails: React.FC<Props> = ({ children }) => {
  return (
    <ViewGap gap={4}>
      <Typo.Title4 {...setTextSemantic('h2')}>Conditions d’utilisation</Typo.Title4>
      {children}
    </ViewGap>
  )
}
