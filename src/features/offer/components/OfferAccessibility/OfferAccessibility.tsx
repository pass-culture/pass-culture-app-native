import React from 'react'

import { OfferAccessibilityResponse } from 'api/gen'
import { AccessibilityBlock } from 'shared/accessibility/AccessibilityBlock'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS } from 'ui/theme'

type Props = {
  accessibility: OfferAccessibilityResponse
}

export function OfferAccessibility({ accessibility }: Readonly<Props>) {
  return (
    <ViewGap gap={4}>
      <TypoDS.BodyAccent>Accessibilité de l’offre</TypoDS.BodyAccent>
      <AccessibilityBlock basicAccessibility={accessibility} />
    </ViewGap>
  )
}
