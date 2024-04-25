import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { shouldShowCulturalSurvey } from 'shared/culturalSurvey/shouldShowCulturalSurvey'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { Typo } from 'ui/theme'

export function BeneficiaryRequestSent() {
  const { user } = useAuthContext()

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
        <InternalTouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="On y va&nbsp;!"
          navigateTo={
            shouldNavigateToCulturalSurvey
              ? { screen: 'CulturalSurveyIntro' }
              : navigateToHomeConfig
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
