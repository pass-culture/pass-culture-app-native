import React from 'react'

import { OfferAccessibilityResponse } from 'api/gen'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  accessibility: OfferAccessibilityResponse
}

export function OfferAccessibility({ accessibility }: Readonly<Props>) {
  return (
    <React.Fragment>
      <Typo.ButtonText>Accessibilité de l’offre</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={4} />
      <AccessibilityBlock {...accessibility} />
    </React.Fragment>
  )
}
