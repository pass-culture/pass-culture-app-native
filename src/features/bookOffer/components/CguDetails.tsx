import React, { ReactNode } from 'react'

import { Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  children: ReactNode
}

export const CguDetails: React.FC<Props> = ({ children }) => {
  return (
    <React.Fragment>
      <TypoDS.Title4 {...getHeadingAttrs(2)}>Conditions d’utilisation</TypoDS.Title4>
      <Spacer.Column numberOfSpaces={4} />
      {children}
    </React.Fragment>
  )
}
