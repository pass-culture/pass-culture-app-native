import React from 'react'

import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'

export function renderAccessibilityExternalLink(url: string) {
  return (
    <ExternalTouchableLink
      as={ButtonInsideText}
      wording={url}
      icon={ExternalSiteFilled}
      externalNav={{ url }}
    />
  )
}
