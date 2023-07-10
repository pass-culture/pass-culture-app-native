import { yupResolver } from '@hookform/resolvers/yup'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useResetPasswordMutation } from 'features/auth/api/useResetPasswordMutation'
import { reinitializePasswordSchema } from 'features/auth/pages/forgottenPassword/ReinitializePassword/schema/reinitializePasswordSchema'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { isTimestampExpired } from 'libs/dates'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { LoadingPage } from 'ui/components/LoadingPage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type ReinitializePasswordFormData = {
  newPassword: string
  confirmedPassword: string
}

export const ReinitializePassword = () => {
  const defaultValues: ReinitializePasswordFormData = {
    newPassword: '',
    confirmedPassword: '',
  }

  const route = useRoute<UseRouteType<'ReinitializePassword'>>()
  const navigation = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar } = useSnackBarContext()

  const [isTimestampExpirationVerified, setIsTimestampExpirationVerified] = useState(false)
  const {
    handleSubmit,
    control,
    formState: { isValid },
    watch,
    trigger,
  } = useForm<ReinitializePasswordFormData>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(reinitializePasswordSchema),
  })

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

  // We use this useEffect in order to validate confirmedPassword when newPassword changes and matches
  const password = watch('newPassword')
  useEffect(() => {
    trigger('confirmedPassword')
  }, [password, trigger])

  const { mutate: resetPassword, isLoading } = useResetPasswordMutation(() => {
    showSuccessSnackBar({
      message: 'Ton mot de passe est modifié\u00a0!',
      timeout: SNACK_BAR_TIME_OUT,
    })
    analytics.logHasChangedPassword('resetPassword')
    navigation.navigate('Login')
  })

  const submitPassword = useCallback(
    ({ newPassword }: ReinitializePasswordFormData) => {
      if (isValid) {
        resetPassword({
          newPassword,
          resetPasswordToken: route.params.token,
        })
      }
    },
    [isValid, resetPassword, route.params.token]
  )

  if (!isTimestampExpirationVerified) {
    return <LoadingPage />
  }
  return (
    <SecondaryPageWithBlurHeader
      headerTitle="Nouveau mot de passe"
      RightButton={<RightButtonText onClose={navigateToHome} wording="Quitter" />}>
      <Spacer.Column numberOfSpaces={8} />
      <Typo.Title3 {...getHeadingAttrs(2)}>Choisis un nouveau mot de passe</Typo.Title3>
      <Spacer.Column numberOfSpaces={10} />
      <Form.MaxWidth>
        <PasswordInputController
          name="newPassword"
          label="Mot de passe"
          control={control}
          autoFocus
          isRequiredField
          withSecurityRules
          securityRulesAlwaysVisible
          onSubmitEditing={handleSubmit(submitPassword)}
        />
        <Spacer.Column numberOfSpaces={10} />
        <PasswordInputController
          name="confirmedPassword"
          label="Confirmer le mot de passe"
          placeholder="Confirmer le mot de passe"
          control={control}
          isRequiredField
          onSubmitEditing={handleSubmit(submitPassword)}
        />
        <Spacer.Column numberOfSpaces={10} />
        <ButtonPrimary
          wording="Continuer"
          onPress={handleSubmit(submitPassword)}
          disabled={!isValid || isLoading}
          isLoading={isLoading}
          accessibilityLabel="Valider le nouveau mot de passe et se connecter"
        />
      </Form.MaxWidth>
    </SecondaryPageWithBlurHeader>
  )
}
