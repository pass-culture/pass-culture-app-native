import { yupResolver } from '@hookform/resolvers/yup'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { AccountState, ResetPasswordResponse } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { useResetPasswordMutation } from 'features/auth/queries/useResetPasswordMutation'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { analytics } from 'libs/analytics/provider'
import { isTimestampExpired } from 'libs/dates'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { newPasswordSchema } from 'shared/forms/schemas/newPasswordSchema'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { RightButtonText } from 'ui/components/headers/RightButtonText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { LoadingPage } from 'ui/pages/LoadingPage'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { getSpacing, Typo } from 'ui/theme'
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
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const loginRoutine = useLoginRoutine()
  const deviceInfo = useDeviceInfo()

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
    resolver: yupResolver(newPasswordSchema),
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

  const { mutate: resetPassword, isLoading } = useResetPasswordMutation({
    onSuccess: (response: ResetPasswordResponse) => {
      showSuccessSnackBar({
        message: 'Ton mot de passe est modifié\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
      analytics.logHasChangedPassword({
        from: route.params.from ?? 'forgottenpassword',
        reason: 'resetPassword',
      })
      loginRoutine(
        {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          accountState: AccountState.ACTIVE,
        },
        'fromReinitializePassword'
      )
      navigateToHome()
    },
    onError: () => {
      showErrorSnackBar({
        message: 'Une erreur s’est produite pendant la modification de ton mot de passe.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const submitPassword = useCallback(
    ({ newPassword }: ReinitializePasswordFormData) => {
      if (isValid) {
        resetPassword({
          newPassword,
          resetPasswordToken: route.params.token,
          deviceInfo,
        })
      }
    },
    [isValid, resetPassword, route.params.token, deviceInfo]
  )

  if (!isTimestampExpirationVerified) {
    return <LoadingPage />
  }
  return (
    <SecondaryPageWithBlurHeader
      title="Nouveau mot de passe"
      RightButton={<RightButtonText onClose={navigateToHome} wording="Quitter" />}>
      <Typo.Title3 {...getHeadingAttrs(2)}>Choisis un nouveau mot de passe</Typo.Title3>
      <Form.MaxWidth>
        <Container>
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
        </Container>
        <Container>
          <PasswordInputController
            name="confirmedPassword"
            label="Confirmer le mot de passe"
            placeholder="Confirmer le mot de passe"
            control={control}
            isRequiredField
            onSubmitEditing={handleSubmit(submitPassword)}
          />
        </Container>
        <Container>
          <ButtonPrimary
            wording="Se connecter"
            onPress={handleSubmit(submitPassword)}
            disabled={!isValid || isLoading}
            isLoading={isLoading}
            accessibilityLabel="Valider le nouveau mot de passe et se connecter"
          />
        </Container>
      </Form.MaxWidth>
    </SecondaryPageWithBlurHeader>
  )
}

const Container = styled.View({
  marginTop: getSpacing(10),
})
