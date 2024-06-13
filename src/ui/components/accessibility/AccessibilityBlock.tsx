import React, { FC } from 'react'

import { OfferAccessibilityResponse } from 'api/gen'
import { BasicAccessibilityInfo } from 'ui/components/accessibility/BasicAccessibilityInfo'

type Props = {
  basicAccessibility?: OfferAccessibilityResponse
}

export const AccessibilityBlock: FC<Props> = ({ basicAccessibility }) => {
  if (basicAccessibility) return <BasicAccessibilityInfo accessibility={basicAccessibility} />
  return null
}
