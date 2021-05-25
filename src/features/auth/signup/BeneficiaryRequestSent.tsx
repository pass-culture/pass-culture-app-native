import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useNotifyIdCheckCompleted } from 'features/auth/api'
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
  const { mutate: notifyIdCheckCompleted } = useNotifyIdCheckCompleted()

  useEffect(() => {
    notifyIdCheckCompleted()
  }, [])

  const shouldNavigateToCulturalSurvey = user?.isBeneficiary && user?.needsToFillCulturalSurvey

  function onPress() {
    if (shouldNavigateToCulturalSurvey) {
      navigate('CulturalSurvey')
    } else {
      navigateToHome()
    }
  }

  return (
    <GenericInfoPage title={t`Demande envoyée !`} icon={RequestSent} iconSize={getSpacing(42)}>
      <StyledBody>{t`Nous étudions ton dossier...`}</StyledBody>
      {shouldNavigateToCulturalSurvey ? (
        <StyledBody>
          {t`Tu recevras un e-mail lorsque ta demande sera validée. En attendant, aide-nous à en savoir plus sur tes pratiques culturelles !`}
        </StyledBody>
      ) : (
        <StyledBody>{t`Tu recevras un e-mail lorsque ta demande sera validée.`}</StyledBody>
      )}
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
