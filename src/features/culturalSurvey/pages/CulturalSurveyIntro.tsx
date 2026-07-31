import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { PhonePending } from 'ui/svg/icons/PhonePending'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

export const CulturalSurveyIntro = (): React.JSX.Element => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavigationConfig)

  const navigateToCulturalSurvey = () => {
    void analytics.logHasStartedCulturalSurvey()
    navigate(...getSubscriptionHookConfig('CulturalSurveyQuestions'))
  }

  return (
    <GenericInfoPage
      illustration={PhonePending}
      subtitle={`Quelques questions et ton\u00a0crédit\u00a0est\u00a0à\u00a0toi.`}
      title={'Tu y es presque\u00a0!'}
      buttonPrimary={{
        wording: 'Commencer le questionnaire',
        onPress: navigateToCulturalSurvey,
      }}
      buttonTertiary={{
        wording: 'Retour',
        icon: PlainArrowPrevious,
        onPress: goBack,
      }}>
      <StyledBody>
        {
          'Parle nous de tes activités culturelles préférées. Tes réponses vont nous aider à mieux te connaître.'
        }
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
