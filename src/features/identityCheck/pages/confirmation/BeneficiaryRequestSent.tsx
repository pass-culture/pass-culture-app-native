import React from 'react'

import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { RequestSent } from 'ui/svg/icons/RequestSent'

export function BeneficiaryRequestSent() {
  const subtitle =
    'Nous étudions ton dossier...\nTu recevras un e-mail lorsque ta demande sera validée. En attendant, aide-nous à en savoir plus sur tes pratiques culturelles\u00a0!'

  return (
    <GenericInfoPage
      illustration={RequestSent}
      title="Demande envoyée&nbsp;!"
      subtitle={subtitle}
      buttonPrimary={{
        wording: 'On y va\u00a0!',
        navigateTo: { screen: 'CulturalSurveyIntro' },
      }}
    />
  )
}
