import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useResetPasswordMutation } from 'features/auth/api/useResetPasswordMutation'
import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { isTimestampExpired } from 'libs/dates'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { LoadingPage } from 'ui/components/LoadingPage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ReinitializePassword = () => {
  const route = useRoute<UseRouteType<'ReinitializePassword'>>()
  const navigation = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar } = useSnackBarContext()

  const [isTimestampExpirationVerified, setIsTimestampExpirationVerified] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const passwordDescribedBy = uuidv4()
  const passwordErrorId = uuidv4()

  const allowSubmission = isPasswordCorrect(password) && confirmedPassword === password
  const displayNotMatchingError = confirmedPassword.length > 0 && confirmedPassword !== password

  useFocusEffect(
    useCallback(() => {
      setIsTimestampExpirationVerified(false)
      const { expiration_timestamp, email } = route.params
      if (isTimestampExpired(expiration_timestamp)) {
        navigation.replace('ResetPasswordExpiredLink', { email })
      } else {
        setIsTimestampExpirationVerified(true)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params])
  )

  const { mutate: resetPassword, isLoading } = useResetPasswordMutation(() => {
    showSuccessSnackBar({
      message: 'Ton mot de passe est modifié\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
    analytics.logHasChangedPassword('resetPassword')
    navigation.navigate('Login')
  })

  const submitPassword = useCallback(() => {
    if (allowSubmission) {
      resetPassword({
        newPassword: password,
        resetPasswordToken: route.params.token,
      })
    }
  }, [allowSubmission, password, resetPassword, route.params.token])

  if (!isTimestampExpirationVerified) {
    return <LoadingPage />
  }
  return (
    <SecondaryPageWithBlurHeader
      headerTitle="Nouveau mot de passe"
      RightButton={<RightButtonText onClose={navigateToHome} wording="Quitter" />}>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title3 {...getHeadingAttrs(2)}>Choisis un nouveau mot de passe</Typo.Title3>
      <Spacer.Column numberOfSpaces={6} />
      <Form.MaxWidth>
        <PasswordInput
          label="Mot de passe"
          accessibilityDescribedBy={passwordDescribedBy}
          value={password}
          autoFocus
          onChangeText={setPassword}
          onSubmitEditing={submitPassword}
          isRequiredField
        />
        <PasswordSecurityRules password={password} nativeID={passwordDescribedBy} />
        <Spacer.Column numberOfSpaces={8} />
        <PasswordInput
          label="Confirmer le mot de passe"
          value={confirmedPassword}
          onChangeText={setConfirmedPassword}
          placeholder="Confirmer le mot de passe"
          onSubmitEditing={submitPassword}
          isRequiredField
          accessibilityDescribedBy={passwordErrorId}
        />
        <Spacer.Column numberOfSpaces={2} />
        <InputError
          visible={displayNotMatchingError}
          messageId="Les mots de passe ne concordent pas"
          numberOfSpacesTop={0}
          relatedInputId={passwordErrorId}
        />
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          wording="Continuer"
          onPress={submitPassword}
          disabled={!allowSubmission || isLoading}
          isLoading={isLoading}
          accessibilityLabel="Valider le nouveau mot de passe et se connecter"
        />
      </Form.MaxWidth>
    </SecondaryPageWithBlurHeader>
  )
}
