import { useNavigation } from '@react-navigation/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'

export const useGetCulturalSurveyContent = (enableCulturalSurveyMandatory: boolean) => {
  const { reset } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavigationConfig)

  const navigateSendAnalyticsAndShowShareAppModal = async () => {
    reset({ index: 0, routes: [{ name: navigateToHomeConfig.screen }] })
    analytics.logHasSkippedCulturalSurvey()
  }

  const navigateToHomeAndShowShareAppModal = async () => {
    reset({ index: 0, routes: [{ name: navigateToHomeConfig.screen }] })
  }

  const navigateToIdentityCheckHonor = async () => {
    reset({
      index: 0,
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: {
            index: 0,
            routes: [{ name: 'IdentityCheckHonor' }],
          },
        },
      ],
    })
  }

  if (enableCulturalSurveyMandatory) {
    return {
      intro: {
        title: 'Tu y es presque\u00a0!',
        subtitle: undefined,
        customSubtitle: `Quelques questions et ton\u00a0crédit\u00a0est\u00a0à\u00a0toi.`,
        bodyText:
          'Parle nous de tes activités culturelles préférées. Tes réponses vont nous aider à mieux te connaître.',
        showFAQLink: false,
        secondaryButton: {
          icon: PlainArrowPrevious,
          text: 'Retour',
          onPress: goBack,
        },
      },
      thanks: {
        subtitle:
          'Elles nous permettent de suivre l’évolution de tes pratiques culturelles sur l’application.',
        button: {
          wording: 'Continuer',
          onPress: navigateToIdentityCheckHonor,
        },
      },
    }
  } else {
    return {
      intro: {
        title: 'Prends 1 minute',
        subtitle: 'pour nous parler de tes activités culturelles préférées',
        customSubtitle: undefined,
        bodyText:
          'En continuant, tu acceptes que nous utilisions les réponses au questionnaire qui va suivre pour améliorer l’application.',
        showFAQLink: true,
        secondaryButton: {
          icon: ClockFilled,
          text: 'Plus tard',
          onPress: navigateSendAnalyticsAndShowShareAppModal,
        },
      },
      thanks: {
        subtitle: 'Tu peux dès maintenant découvrir l’étendue du catalogue pass Culture.',
        button: {
          wording: 'Découvrir le catalogue',
          onPress: navigateToHomeAndShowShareAppModal,
        },
      },
    }
  }
}
