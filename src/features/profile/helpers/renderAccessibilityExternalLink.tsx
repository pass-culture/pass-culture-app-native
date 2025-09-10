import React from 'react'

import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'

export function renderAccessibilityExternalLink(url: string) {
  return <ExternalTouchableLink as={LinkInsideText} wording={url} externalNav={{ url }} />
}
