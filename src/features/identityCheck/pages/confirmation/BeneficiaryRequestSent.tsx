import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useShouldShowCulturalSurveyForBeneficiaryUser } from 'shared/culturalSurvey/useShouldShowCulturalSurveyForBeneficiaryUser'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { LINE_BREAK } from 'ui/theme/constants'

export function BeneficiaryRequestSent() {
  const { user } = useAuthContext()
  const shouldShowCulturalSurvey = useShouldShowCulturalSurveyForBeneficiaryUser()
  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  const body = 'Tu recevras un e-mail lorsque ta demande sera validée.'

  let inTheMeantime = ''
  if (shouldNavigateToCulturalSurvey) {
    inTheMeantime = 'En attendant, aide-nous à en savoir plus sur tes pratiques culturelles\u00a0!'
  }

  const message = inTheMeantime.length ? `${body} ${inTheMeantime}` : body

  return (
    <GenericInfoPage
      illustration={RequestSent}
      title="Demande envoyée&nbsp;!"
      subtitle={`Nous étudions ton dossier...${LINE_BREAK}${message}`}
      buttonPrimary={{
        wording: 'On y va\u00a0!',
        navigateTo: shouldNavigateToCulturalSurvey
          ? { screen: 'CulturalSurveyIntro' }
          : navigateToHomeConfig,
      }}
    />
  )
}
