import React from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'

export const ContactSupportButton = () => (
  <ExternalTouchableLink
    as={LinkInsideText}
    wording="Contacter le support"
    externalNav={{ url: env.SUPPORT_ACCOUNT_ISSUES_FORM }}
    accessibilityRole={AccessibilityRole.LINK}
    justifyContent="flex-start"
  />
)
