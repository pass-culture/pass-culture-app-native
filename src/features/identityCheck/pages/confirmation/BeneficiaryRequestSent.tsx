import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { shouldShowCulturalSurvey } from 'features/firstLogin/helpers'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { RequestSent } from 'ui/svg/icons/RequestSent'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function BeneficiaryRequestSent() {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: user } = useUserProfileInfo()
  const { data: settings } = useAppSettings()

  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  function onPress() {
    if (shouldNavigateToCulturalSurvey) {
      navigate('CulturalSurvey')
    } else {
      navigateToHome()
    }
  }

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
    <GenericInfoPage title={t`Demande envoyée\u00a0!`} icon={RequestSent} iconSize={getSpacing(42)}>
      <StyledBody>{t`Nous étudions ton dossier...`}</StyledBody>
      <StyledBody>{message}</StyledBody>
      <Spacer.Column numberOfSpaces={15} />
      <ButtonPrimaryWhite title={t`On y va\u00a0!`} onPress={onPress} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
