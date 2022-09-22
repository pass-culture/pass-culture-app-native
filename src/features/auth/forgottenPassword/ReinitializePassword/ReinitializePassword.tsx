import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import {
  isPasswordCorrect,
  PasswordSecurityRules,
} from 'features/auth/components/PasswordSecurityRules'
import { useResetPasswordMutation } from 'features/auth/mutations'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { isTimestampExpired } from 'libs/dates'
import { analytics } from 'libs/firebase/analytics'
import { BottomCardContentContainer } from 'ui/components/BottomCardContentContainer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { LoadingPage } from 'ui/components/LoadingPage'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

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

  function submitPassword() {
    if (allowSubmission) {
      resetPassword({
        newPassword: password,
        resetPasswordToken: route.params.token,
      })
    }
  }

  if (!isTimestampExpirationVerified) {
    return <LoadingPage />
  }
  return (
    <BottomContentPage>
      <ModalHeader
        title="Ton mot de passe"
        rightIconAccessibilityLabel="Revenir à l’accueil"
        rightIcon={Close}
        onRightIconPress={navigateToHome}
      />
      <BottomCardContentContainer>
        <Spacer.Column numberOfSpaces={6} />
        <Form.MaxWidth>
          <PasswordInput
            label="Nouveau mot de passe"
            accessibilityDescribedBy={passwordDescribedBy}
            value={password}
            autoFocus
            onChangeText={setPassword}
            placeholder="Ton mot de passe"
            onSubmitEditing={submitPassword}
            isRequiredField
          />
          <PasswordSecurityRules password={password} nativeID={passwordDescribedBy} />
          <Spacer.Column numberOfSpaces={6} />
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
          />
        </Form.MaxWidth>
      </BottomCardContentContainer>
    </BottomContentPage>
  )
}
