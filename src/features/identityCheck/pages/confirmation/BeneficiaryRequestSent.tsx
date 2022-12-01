import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import {
  shouldShowCulturalSurvey,
  useCulturalSurveyRoute,
} from 'features/culturalSurvey/helpers/utils'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { Typo } from 'ui/theme'

export function BeneficiaryRequestSent() {
  const { user } = useAuthContext()
  const culturalSurveyRoute = useCulturalSurveyRoute()

  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  const body = 'Tu recevras un e-mail lorsque ta demande sera validée.'

  let inTheMeantime = ''
  if (shouldNavigateToCulturalSurvey) {
    inTheMeantime = 'En attendant, aide-nous à en savoir plus sur tes pratiques culturelles\u00a0!'
  }

  const message = inTheMeantime.length ? `${body} ${inTheMeantime}` : body

  return (
    <GenericInfoPage
      title="Demande envoyée&nbsp;!"
      icon={RequestSent}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="On y va&nbsp;!"
          navigateTo={
            shouldNavigateToCulturalSurvey ? { screen: culturalSurveyRoute } : navigateToHomeConfig
          }
        />,
      ]}>
      <StyledBody>Nous étudions ton dossier...</StyledBody>
      <StyledBody>{message}</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
