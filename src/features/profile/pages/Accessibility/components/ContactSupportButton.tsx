import React from 'react'

import { contactSupport } from 'features/auth/support.services'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

export const ContactSupportButton = () => (
  <TouchableLink
    as={ButtonTertiaryBlack}
    wording="support@passculture.app"
    accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
    justifyContent="flex-start"
    externalNav={contactSupport.forGenericQuestion}
    icon={EmailFilled}
  />
)
