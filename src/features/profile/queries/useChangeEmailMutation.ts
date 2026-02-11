import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const useChangeEmailMutation = () => {
  const { replace } = useNavigation<UseNavigationType>()

  const { mutate: changeEmail, isPending } = useMutation({
    mutationFn: () => api.postNativeV2ProfileUpdateEmail(),
    onSuccess: () => {
      showSuccessSnackBar(
        'E-mail envoyé sur ton adresse actuelle\u00a0! Tu as 24h pour valider ta demande. Si tu ne le trouves pas, pense à vérifier tes spams.'
      )
      replace(...getProfileHookConfig('TrackEmailChange'))
    },
    onError: () => {
      showErrorSnackBar(
        'Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.'
      )
    },
  })

  return {
    changeEmail,
    isLoading: isPending,
  }
}
