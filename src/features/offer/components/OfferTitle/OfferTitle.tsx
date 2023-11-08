import React from 'react'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  offerName: string
}

export function OfferTitle({ offerName }: Readonly<Props>) {
  const titleProps = {
    adjustsFontSizeToFit: true,
    allowFontScaling: false,
    ...accessibilityAndTestId(`Nom de l’offre\u00a0: ${offerName}`),
    ...getHeadingAttrs(1),
  }

  return <Typo.Title3 {...titleProps}>{offerName}</Typo.Title3>
}
