import { yupResolver } from '@hookform/resolvers/yup'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { useTheme } from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { SSOButton } from 'features/auth/components/SSOButton/SSOButton'
import { setEmailSchema } from 'features/auth/pages/signup/SetEmail/schema/setEmailSchema'
import { PreValidationSignupNormalStepProps, SignInResponseFailure } from 'features/auth/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { Form } from 'ui/components/Form'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { Separator } from 'ui/components/Separator'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer } from 'ui/theme'
import { CaptionNeutralInfo, Typo } from 'ui/theme/typography'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  email: string
  marketingEmailSubscription: boolean
}

type InputControlled<fieldName extends keyof FormValues> = {
  field: ControllerRenderProps<FormValues, fieldName>
}

const NewsletterCheckboxControlled = ({
  field: { value, onChange },
}: InputControlled<'marketingEmailSubscription'>) => (
  <Checkbox
    isChecked={value}
    label="J’accepte de recevoir les newsletters, bons plans et recommandations personnalisées du pass Culture."
    onPress={onChange}
  />
)

export const SetEmail: FunctionComponent<PreValidationSignupNormalStepProps> = ({
  goToNextStep,
  accessibilityLabelForNextStep,
  previousSignupData,
  onSSOEmailNotFoundError,
}) => {
  const enableGoogleSSO = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GOOGLE_SSO)
  const { params } = useRoute<UseRouteType<'SignupForm'>>()
  const theme = useTheme()
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      email: previousSignupData.email,
      marketingEmailSubscription: previousSignupData.marketingEmailSubscription ?? false,
    },
    resolver: yupResolver(setEmailSchema),
    mode: 'onSubmit',
  })

  const onLogAnalytics = useCallback(() => {
    firebaseAnalytics.logLogin({ method: 'fromSetEmail' })
  }, [])

  const goToNextStepCallback = useCallback(
    ({ email, marketingEmailSubscription }: FormValues) => {
      goToNextStep({ email, marketingEmailSubscription })
    },
    [goToNextStep]
  )

  const onLogHasCorrectedEmail = useCallback(() => {
    analytics.logHasCorrectedEmail({ from: 'setemail' })
  }, [])

  useEffect(() => {
    analytics.logScreenViewSetEmail()
  }, [])

  const onSSOSignInFailure = useCallback(
    (errorResponse: SignInResponseFailure) => {
      if (errorResponse.content?.code === 'SSO_EMAIL_NOT_FOUND') {
        onSSOEmailNotFoundError()
        goToNextStep({})
      }
    },
    [goToNextStep, onSSOEmailNotFoundError]
  )

  return (
    <Form.MaxWidth>
      <Typo.Title3 {...getHeadingAttrs(2)}>Crée-toi un compte</Typo.Title3>
      <Spacer.Column numberOfSpaces={10} />
      <EmailInputController
        control={control}
        name="email"
        onSpellingHelpPress={onLogHasCorrectedEmail}
        autoFocus
      />
      <Spacer.Column numberOfSpaces={8} />
      <Controller
        control={control}
        name="marketingEmailSubscription"
        render={NewsletterCheckboxControlled}
      />
      <Spacer.Column numberOfSpaces={10} />
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={8} />
      <CaptionNeutralInfo>
        Le pass Culture traite tes données pour la gestion de ton compte et pour l’inscription à la
        newsletter.
      </CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={2} />
      <ExternalTouchableLink
        as={ButtonQuaternaryBlack}
        externalNav={{ url: env.FAQ_LINK_PERSONAL_DATA }}
        wording="Comment gérer tes données personnelles&nbsp;?"
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
        numberOfLines={2}
        inline
      />
      <Spacer.Column numberOfSpaces={10} />
      <ButtonPrimary
        wording="Continuer"
        accessibilityLabel={accessibilityLabelForNextStep}
        onPress={handleSubmit(goToNextStepCallback)}
        isLoading={false}
        disabled={watch('email').trim() === ''}
      />
      {enableGoogleSSO ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <StyledSeparatorWithText label="ou" />
          <Spacer.Column numberOfSpaces={4} />
          <SSOButton type="signup" onSignInFailure={onSSOSignInFailure} />
          <Spacer.Column numberOfSpaces={10} />
        </React.Fragment>
      ) : (
        <Spacer.Column numberOfSpaces={8} />
      )}
      <AuthenticationButton
        type="login"
        onAdditionalPress={onLogAnalytics}
        linkColor={theme.colors.secondary}
        params={{ offerId: params?.offerId }}
      />
      <Spacer.Column numberOfSpaces={5} />
    </Form.MaxWidth>
  )
}

const StyledSeparatorWithText = styled(SeparatorWithText).attrs(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))``
