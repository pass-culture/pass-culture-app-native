import { useNavigation } from '@react-navigation/native'
import { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { CHANGE_EMAIL_ERROR_CODE } from 'features/profile/enums'
import { ChangeEmailRequest } from 'features/profile/types'
import { analytics } from 'libs/firebase/analytics'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const useChangeEmailMutation = ({
  setPasswordErrorMessage,
}: {
  setPasswordErrorMessage: Dispatch<SetStateAction<string | null>>
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
    (body: ChangeEmailRequest) => api.postnativev1profileupdateEmail(body),
    {
      onSuccess: () => {
        showSuccessSnackBar({
          message:
            'E-mail envoyé\u00a0! Tu as 24h pour activer ta nouvelle adresse. Si tu ne le trouves pas, pense à vérifier tes spams.',
          timeout: SNACK_BAR_TIME_OUT,
        })
        navigateToProfile()
        analytics.logSaveNewMail()
      },
      onError: (error: ApiError | unknown) => {
        onEmailChangeError((error as ApiError)?.content?.code)
      },
    }
  )

  return {
    changeEmail,
    isLoading,
  }
}
