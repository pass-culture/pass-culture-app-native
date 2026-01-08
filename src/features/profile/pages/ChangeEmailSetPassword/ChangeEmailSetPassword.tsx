import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useChangeEmailSetPasswordMutation } from 'features/profile/queries/useChangeEmailSetPasswordMutation'
import { eventMonitoring } from 'libs/monitoring/services'
import { PasswordInputController } from 'shared/forms/controllers/PasswordInputController'
import { newPasswordSchema } from 'shared/forms/schemas/newPasswordSchema'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  newPassword: string
  confirmedPassword: string
}

export const ChangeEmailSetPassword = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'ChangeEmailSetPassword'>>()
  const { showErrorSnackBar, showSuccessSnackBar } = useSnackBarContext()
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: {
      newPassword: '',
      confirmedPassword: '',
    },
    resolver: yupResolver(newPasswordSchema),
    mode: 'onChange',
  })

  const { mutate: setPassword, isPending } = useChangeEmailSetPasswordMutation({
    onSuccess: () => {
      showSuccessSnackBar({
        message: 'Ton mot de passe a bien été créé.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      if (!params?.emailSelectionToken) return // emailSelectionToken should never be undefined if token is defined
      replace(...getProfileHookConfig('NewEmailSelection', { token: params?.emailSelectionToken }))
    },
    onError: () =>
      showErrorSnackBar({
        message:
          'Une erreur s’est produite lors de la création du mot de passe. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      }),
  })

  const onSubmit = handleSubmit(({ newPassword }) => {
    if (!params?.token || typeof params?.token !== 'string') {
      eventMonitoring.captureException(
        new Error(`Expected a string, but received ${typeof params?.token}`)
      )
      return
    }
    setPassword({ resetPasswordToken: params?.token, newPassword })
  })

  return (
    <SecondaryPageWithBlurHeader title="Créer mon mot de passe">
      <StyledView paddingBottom={Platform.OS === 'ios' ? keyboardHeight : 0}>
        <ViewGap gap={4}>
          <Typo.Title3 {...getHeadingAttrs(2)}>Crée ton mot de passe</Typo.Title3>
          <Typo.Body>
            Tu t’es inscrit via Google, tu ne possèdes donc pas de mot de passe actuellement.
          </Typo.Body>
          <Typo.Body>
            Ce mot de passe te permettra de te connecter avec ta nouvelle adresse e-mail.
          </Typo.Body>
        </ViewGap>
        <Form.MaxWidth flex={1}>
          <Container>
            <PasswordInputController
              name="newPassword"
              label="Mot de passe"
              control={control}
              requiredIndicator="explicit"
              withSecurityRules
              securityRulesAlwaysVisible
            />
          </Container>
          <Container>
            <PasswordInputController
              name="confirmedPassword"
              label="Confirmer le mot de passe"
              control={control}
              requiredIndicator="explicit"
            />
          </Container>
          <Container>
            <ButtonPrimary
              wording="Créer mon mot de passe"
              disabled={!isValid}
              isLoading={isPending}
              onPress={onSubmit}
            />
          </Container>
        </Form.MaxWidth>
      </StyledView>
    </SecondaryPageWithBlurHeader>
  )
}

const StyledView = styled.View<{ paddingBottom: number }>(({ paddingBottom }) => ({
  paddingBottom,
}))

const Container = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxxl,
}))
