import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import {
  shouldShowCulturalSurvey,
  useCulturalSurveyRoute,
} from 'features/culturalSurvey/helpers/utils'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { Typo } from 'ui/theme'

export function BeneficiaryRequestSent() {
  const { data: user } = useUserProfileInfo()
  const { data: settings } = useAppSettings()
  const culturalSurveyRoute = useCulturalSurveyRoute()

  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  const body = settings?.enableIdCheckRetention
    ? t`Tu recevras une réponse par e-mail sous 5 jours ouvrés.`
    : t`Tu recevras un e-mail lorsque ta demande sera validée.`

  let inTheMeantime = ''
  if (shouldNavigateToCulturalSurvey) {
    inTheMeantime = t`En attendant, aide-nous à en savoir plus sur tes pratiques culturelles\u00a0!`
  } else if (settings?.enableIdCheckRetention) {
    inTheMeantime = t`En attendant, tu peux découvrir l'application\u00a0!`
  }

  const message = inTheMeantime.length ? `${body} ${inTheMeantime}` : body

  return (
    <GenericInfoPage
      title={t`Demande envoyée\u00a0!`}
      icon={RequestSent}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`On y va\u00a0!`}
          navigateTo={
            shouldNavigateToCulturalSurvey ? { screen: culturalSurveyRoute } : navigateToHomeConfig
          }
        />,
      ]}>
      <StyledBody>{t`Nous étudions ton dossier...`}</StyledBody>
      <StyledBody>{message}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
