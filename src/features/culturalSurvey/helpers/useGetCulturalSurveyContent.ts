import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'

export const useGetCulturalSurveyContent = () => {
  const { reset } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavigationConfig)

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
}
