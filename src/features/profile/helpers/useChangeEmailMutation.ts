import { useNavigation } from '@react-navigation/native'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import {
  SNACK_BAR_TIME_OUT,
  SNACK_BAR_TIME_OUT_LONG,
  useSnackBarContext,
} from 'ui/components/snackBar/SnackBarContext'

export const useChangeEmailMutation = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const { mutate: changeEmail, isLoading } = useMutation(
    () => api.postNativeV2ProfileUpdateEmail(),
    {
      onSuccess: () => {
        showSuccessSnackBar({
          message:
            'E-mail envoyé sur ton adresse actuelle\u00a0! Tu as 24h pour valider ta demande. Si tu ne le trouves pas, pense à vérifier tes spams.',
          timeout: SNACK_BAR_TIME_OUT_LONG,
        })
        replace(...getProfileStackConfig('TrackEmailChange'))
      },
      onError: () => {
        showErrorSnackBar({
          message:
            'Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.',
          timeout: SNACK_BAR_TIME_OUT,
        })
      },
    }
  )

  return {
    changeEmail,
    isLoading,
  }
}
