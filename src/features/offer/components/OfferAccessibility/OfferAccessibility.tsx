import React from 'react'

import { OfferAccessibilityResponse } from 'api/gen'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type Props = {
  accessibility: OfferAccessibilityResponse
}

export function OfferAccessibility({ accessibility }: Readonly<Props>) {
  return (
    <ViewGap gap={4}>
      <Typo.ButtonText>Accessibilité de l’offre</Typo.ButtonText>
      <AccessibilityBlock {...accessibility} />
    </ViewGap>
  )
}
