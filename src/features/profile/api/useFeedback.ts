import { useNavigation } from '@react-navigation/native'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { PostFeedbackBody } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const useFeedback = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  return useMutation((body: PostFeedbackBody) => api.postNativeV1Feedback(body), {
    onSuccess: () => {
      showSuccessSnackBar({
        message: 'Ta suggestion a bien été transmise\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
      navigateToProfile()
    },
    onError: () => {
      showErrorSnackBar({
        message: 'Une erreur s’est produite lors de l’envoi de ta suggestion. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })
}
