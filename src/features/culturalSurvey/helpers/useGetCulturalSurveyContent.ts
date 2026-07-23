import { useNavigation } from '@react-navigation/native'

import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'

export const useGetCulturalSurveyContent = () => {
  const { navigate, reset } = useNavigation<UseNavigationType>()
  const { questionsToDisplay: initialQuestions } = useCulturalSurveyContext()
  const { goBack } = useGoBack(...homeNavigationConfig)

  const navigateToCulturalSurvey = () => {
    void analytics.logHasStartedCulturalSurvey()
    const firstQuestion = initialQuestions[0]
    if (!firstQuestion) return
    navigate(...getSubscriptionHookConfig('CulturalSurveyQuestions', { question: firstQuestion }))
  }

  const navigateToIdentityCheckHonor = () => {
    reset({
      index: 0,
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: { index: 0, routes: [{ name: 'IdentityCheckHonor' }] },
        },
      ],
    })
  }

  return {
    intro: {
      title: 'Tu y es presque\u00a0!',
      subtitle: undefined,
      customSubtitle: `Quelques questions et ton\u00a0crédit\u00a0est\u00a0à\u00a0toi.`,
      bodyText:
        'Parle nous de tes activités culturelles préférées. Tes réponses vont nous aider à mieux te connaître.',
      showFAQLink: false,
      button: { wording: 'Commencer le questionnaire', onPress: navigateToCulturalSurvey },
      secondaryButton: { icon: PlainArrowPrevious, wording: 'Retour', onPress: goBack },
    },
    thanks: {
      subtitle:
        'Elles nous permettent de suivre l’évolution de tes pratiques culturelles sur l’application.',
      button: { wording: 'Continuer', onPress: navigateToIdentityCheckHonor },
    },
  }
}
