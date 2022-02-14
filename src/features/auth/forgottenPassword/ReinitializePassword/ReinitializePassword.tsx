import { t } from '@lingui/macro'
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
import { analytics } from 'libs/analytics'
import { isTimestampExpired } from 'libs/dates'
import { BottomCardContentContainer } from 'ui/components/BottomCardContentContainer'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { PasswordInput } from 'ui/components/inputs/PasswordInput'
import { LoadingPage } from 'ui/components/LoadingPage'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

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
    }, [route.params])
  )

  const { mutate: resetPassword, isLoading } = useResetPasswordMutation(() => {
    showSuccessSnackBar({
      message: t`Ton mot de passe a été modifié\u00a0!`,
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
        title={t`Ton mot de passe`}
        leftIconAccessibilityLabel={undefined}
        leftIcon={undefined}
        onLeftIconPress={undefined}
        rightIconAccessibilityLabel={t`Revenir à l'accueil`}
        rightIcon={Close}
        onRightIconPress={navigateToHome}
      />
      <BottomCardContentContainer>
        <Spacer.Column numberOfSpaces={6} />
        <Form.MaxWidth>
          <PasswordInput
            label={t`Nouveau mot de passe`}
            accessibilityDescribedBy={passwordDescribedBy}
            value={password}
            autoFocus
            onChangeText={setPassword}
            placeholder={t`Ton mot de passe`}
            onSubmitEditing={submitPassword}
            isRequiredField
          />
          <PasswordSecurityRules password={password} nativeID={passwordDescribedBy} />
          <Spacer.Column numberOfSpaces={6} />
          <PasswordInput
            label={t`Confirmer le mot de passe`}
            value={confirmedPassword}
            onChangeText={setConfirmedPassword}
            placeholder={t`Confirmer le mot de passe`}
            onSubmitEditing={submitPassword}
            isRequiredField
            accessibilityDescribedBy={passwordErrorId}
          />
          <Spacer.Column numberOfSpaces={2} />
          <InputError
            visible={displayNotMatchingError}
            messageId={t`Les mots de passe ne concordent pas`}
            numberOfSpacesTop={0}
            relatedInputId={passwordErrorId}
          />
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            wording={t`Continuer`}
            onPress={submitPassword}
            disabled={!allowSubmission || isLoading}
            isLoading={isLoading}
          />
        </Form.MaxWidth>
      </BottomCardContentContainer>
    </BottomContentPage>
  )
}
