import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
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

  const shouldNavigateToCulturalSurvey = user?.isBeneficiary && user?.needsToFillCulturalSurvey

  function onPress() {
    if (shouldNavigateToCulturalSurvey) {
      navigate('CulturalSurvey')
    } else {
      navigateToHome()
    }
  }

  let body = t`Tu recevras un e-mail lorsque ta demande sera validée.`
  if (shouldNavigateToCulturalSurvey) {
    body = t`Tu recevras un e-mail lorsque ta demande sera validée. En attendant, aide-nous à en savoir plus sur tes pratiques culturelles !`
  }

  if (settings?.enableIdCheckRetention) {
    body = t`Tu recevras une réponse par e-mail sous 5 jours ouvrés. En attendant, tu peux découvrir l'application !`
    if (shouldNavigateToCulturalSurvey) {
      body = t`Tu recevras une réponse par e-mail sous 5 jours ouvrés. En attendant, aide-nous à en savoir plus sur tes pratiques culturelles !`
    }
  }

  return (
    <GenericInfoPage title={t`Demande envoyée !`} icon={RequestSent} iconSize={getSpacing(42)}>
      <StyledBody>{t`Nous étudions ton dossier...`}</StyledBody>
      <StyledBody>{body}</StyledBody>
      <Spacer.Column numberOfSpaces={15} />
      <ButtonPrimaryWhite title={t`On y va !`} onPress={onPress} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
