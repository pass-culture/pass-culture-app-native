import React from 'react'

import { OfferAccessibilityResponse } from 'api/gen'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  accessibility: OfferAccessibilityResponse
}

export function OfferAccessibility({ accessibility }: Readonly<Props>) {
  const { audioDisability, mentalDisability, motorDisability, visualDisability } = accessibility

  if (
    isNullOrUndefined(visualDisability) &&
    isNullOrUndefined(audioDisability) &&
    isNullOrUndefined(mentalDisability) &&
    isNullOrUndefined(motorDisability)
  )
    return null

  return (
    <React.Fragment>
      <Typo.ButtonText>Accessibilité de l’offre</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={4} />
      <AccessibilityBlock {...accessibility} />
    </React.Fragment>
  )
}
