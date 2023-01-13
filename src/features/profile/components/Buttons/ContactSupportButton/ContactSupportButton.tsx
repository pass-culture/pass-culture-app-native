import React from 'react'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const ContactSupportButton = () => (
  <ExternalTouchableLink
    as={ButtonTertiaryBlack}
    wording="support@passculture.app"
    accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
    justifyContent="flex-start"
    externalNav={contactSupport.forGenericQuestion}
    icon={EmailFilled}
  />
)
