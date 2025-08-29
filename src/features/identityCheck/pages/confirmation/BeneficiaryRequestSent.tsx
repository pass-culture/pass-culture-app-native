import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { LINE_BREAK } from 'ui/theme/constants'

export function BeneficiaryRequestSent() {
  const subtitle = `Nous étudions ton dossier...${LINE_BREAK}Tu recevras un e-mail lorsque ta demande sera validée.`

  return (
    <GenericInfoPage
      illustration={RequestSent}
      title="Demande envoyée&nbsp;!"
      subtitle={subtitle}
      buttonPrimary={{
        wording: 'On y va\u00a0!',
        navigateTo: navigateToHomeConfig,
      }}
    />
  )
}
