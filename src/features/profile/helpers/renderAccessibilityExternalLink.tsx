import React from 'react'

import { ButtonInsideTextV2 } from 'ui/components/buttons/buttonInsideText/ButtonInsideTextV2'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'

export function renderAccessibilityExternalLink(url: string) {
  return <ExternalTouchableLink as={ButtonInsideTextV2} wording={url} externalNav={{ url }} />
}
