import { useNavigation } from '@react-navigation/native'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { isApiError } from 'api/apiHelpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { CHANGE_EMAIL_ERROR_CODE } from 'features/profile/enums'
import { ChangeEmailRequest } from 'features/profile/types'
import { analytics } from 'libs/analytics'
import {
  SNACK_BAR_TIME_OUT,
  SNACK_BAR_TIME_OUT_LONG,
  useSnackBarContext,
} from 'ui/components/snackBar/SnackBarContext'

export const useChangeEmailMutation = ({
  setPasswordErrorMessage,
}: {
  setPasswordErrorMessage: (message: string) => void
}) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))

  const onEmailChangeError = (errorCode?: string) => {
    if (errorCode) {
      analytics.logErrorSavingNewEmail(errorCode)
    }
    if (errorCode === CHANGE_EMAIL_ERROR_CODE.INVALID_PASSWORD) {
      setPasswordErrorMessage('Mot de passe incorrect')
    } else {
      showErrorSnackBar({
        message:
          'Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  const { mutate: changeEmail, isLoading } = useMutation(
    (body: ChangeEmailRequest) => api.postNativeV1ProfileUpdateEmail(body),
    {
      onSuccess: () => {
        showSuccessSnackBar({
          message:
            'E-mail envoyé sur ton adresse actuelle\u00a0! Tu as 24h pour valider ta demande. Si tu ne le trouves pas, pense à vérifier tes spams.',
          timeout: SNACK_BAR_TIME_OUT_LONG,
        })
        navigateToProfile()
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
