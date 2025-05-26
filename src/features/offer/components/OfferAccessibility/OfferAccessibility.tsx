import React, { FunctionComponent } from 'react'

import { OfferAccessibilityResponse } from 'api/gen'
import { BasicAccessibilityInfo } from 'ui/components/accessibility/BasicAccessibilityInfo'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type Props = {
  accessibility: OfferAccessibilityResponse
}

export const OfferAccessibility: FunctionComponent<Props> = ({ accessibility }) => {
  return (
    <ViewGap gap={4}>
      <Typo.BodyAccent>Accessibilité de l’offre</Typo.BodyAccent>
      <BasicAccessibilityInfo accessibility={accessibility} />
    </ViewGap>
  )
}
