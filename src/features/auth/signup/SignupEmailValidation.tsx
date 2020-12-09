import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { ValidateEmailResponse } from 'api/gen'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { LoadingPage } from 'ui/components/LoadingPage'

import { loginRoutine } from '../AuthContext'
import { useValidateEmailMutation } from '../mutations'

export function SignupEmailValidation() {
  // TODO: uncomment this section https://passculture.atlassian.net/browse/PC-5139
  // const { displayInfosSnackBar } = useSnackBarContext()

  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'SignupEmailValidation'>>()

  const { mutate: validateEmail } = useValidateEmailMutation(
    async ({ idCheckToken, accessToken, refreshToken }: ValidateEmailResponse) => {
      await loginRoutine({ accessToken, refreshToken }, 'fromSignup')

      if (idCheckToken !== null) {
        // proceed to IdCheck
      } else {
        setTimeout(() => {
          navigate('Home', { shouldDisplayLoginModal: false })
        }, 2000)
      }
    }
    // TODO: uncomment this section https://passculture.atlassian.net/browse/PC-5139
    // () => {
    //   displayInfosSnackBar({
    //     message: _(t`Ce lien de validation n'est plus valide`),
    //   })
    //   navigate('Home', { shouldDisplayLoginModal: false })
    // }
  )

  useEffect(() => {
    validateEmail({
      emailValidationToken: params.token,
    })
  }, [])

  return <LoadingPage />
}
