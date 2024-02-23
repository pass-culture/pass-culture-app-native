import { useNavigation } from '@react-navigation/native'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ChangeEmailRequest } from 'features/profile/types'
import { analytics } from 'libs/analytics'
import {
  SNACK_BAR_TIME_OUT,
  SNACK_BAR_TIME_OUT_LONG,
  useSnackBarContext,
} from 'ui/components/snackBar/SnackBarContext'

export const useChangeEmailMutationV2 = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const onEmailChangeError = (errorCode?: string) => {
    if (errorCode) {
      analytics.logErrorSavingNewEmail(errorCode)
    }
    showErrorSnackBar({
      message:
        'Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const { mutate: changeEmail, isLoading } = useMutation(
    (body: ChangeEmailRequest) => api.postNativeV2ProfileUpdateEmail(body),
    {
      onSuccess: () => {
        showSuccessSnackBar({
          message:
            'E-mail envoyé sur ton adresse actuelle\u00a0! Tu as 24h pour valider ta demande. Si tu ne le trouves pas, pense à vérifier tes spams.',
          timeout: SNACK_BAR_TIME_OUT_LONG,
        })
        navigate('TrackEmailChange')
        analytics.logSaveNewMail()
      },
      onError: (error: unknown) => {
        onEmailChangeError(isApiError(error) ? error.content?.code : undefined)
      },
    }
  )

  return {
    changeEmail,
    isLoading,
  }
}
