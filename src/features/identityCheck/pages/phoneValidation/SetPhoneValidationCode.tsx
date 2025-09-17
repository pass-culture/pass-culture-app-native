import { CommonActions, useNavigation } from '@react-navigation/native'
import { CountryCode } from 'libphonenumber-js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import { extractApiErrorMessage, isApiError } from 'api/apiHelpers'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { invalidateStepperInfoQueries } from 'features/identityCheck/pages/helpers/invalidateStepperQueries'
import { CodeNotReceivedModal } from 'features/identityCheck/pages/phoneValidation/CodeNotReceivedModal'
import { formatPhoneNumberForDisplay } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import { usePhoneValidationRemainingAttemptsQuery } from 'features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery'
import { useValidatePhoneNumberMutation } from 'features/identityCheck/queries/useValidatePhoneNumberMutation'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { analytics } from 'libs/analytics/provider'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Form } from 'ui/components/Form'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { useModal } from 'ui/components/modals/useModal'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Again } from 'ui/svg/icons/Again'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SetPhoneValidationCode = () => {
  const { phoneValidation } = useSubscriptionContext()
  const formattedPhoneNumber = phoneValidation?.phoneNumber
    ? formatPhoneNumberForDisplay(
        phoneValidation?.phoneNumber,
        phoneValidation?.country.countryCode as CountryCode
      )
    : ''
  const { navigate, dispatch } = useNavigation<UseNavigationType>()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const { remainingAttempts } = usePhoneValidationRemainingAttemptsQuery()

  // We amend our navigation history to replace "SetPhoneNumber" with "PhoneValidationTooManySMSSent"
  const goBackToPhoneValidationTooManySMSSent = () => {
    dispatch((rootState) => {
      // This `rootState` is the state of the top-level navigator.
      // It might look like: { index: 0, routes: [{ name: 'SubscriptionStackNavigator', state: {...} }] }

      // 1. Find the SubscriptionStackNavigator's state
      const subscriptionStackRoute = rootState.routes.find(
        (route) => route.name === 'SubscriptionStackNavigator'
      )

      // If for some reason we're not in that stack, do nothing.
      if (!subscriptionStackRoute?.state) {
        // Returning the original state effectively does nothing.
        return CommonActions.reset(rootState)
      }

      const subState = subscriptionStackRoute.state

      // 2. Perform your the logic on the NESTED state
      const stepperIndex = subState.routes.findIndex((route) => route.name === 'Stepper')
      const baseRoutes =
        stepperIndex === -1 ? subState.routes : subState.routes.slice(0, stepperIndex + 1)

      const newSubRoutes = [...baseRoutes, { name: 'PhoneValidationTooManySMSSent' }]
      // Here we reset the state AND navigate to the page whose index is given to the "index" parameter.
      // Therefore, we navigate to "PhoneValidationTooManySMSSent"

      // 3. Create a new version of the SubscriptionStackNavigator's state
      const newSubState = {
        ...subState,
        routes: newSubRoutes,
        index: newSubRoutes.length - 1,
      }

      // 4. Rebuild the root navigator's routes array with the modified stack state
      const newRootRoutes = rootState.routes.map((route) => {
        if (route.name === 'SubscriptionStackNavigator') {
          return { ...route, state: newSubState }
        }
        return route
      })

      // 5. Return the reset action with the fully reconstructed new root state
      return CommonActions.reset({
        ...rootState,
        routes: newRootRoutes,
      })
    })
  }

  const [codeInputState, setCodeInputState] = useState({
    code: '',
    isValid: false,
  })
  const [errorMessage, setErrorMessage] = useState('')

  const { visible: isCodeNotReceivedModalVisible, hideModal, showModal } = useModal(false)

  const openMissingCodeModal = useCallback(() => {
    analytics.logHasClickedMissingCode()
    showModal()
  }, [showModal])

  const { mutate: validatePhoneNumber, isLoading } = useValidatePhoneNumberMutation({
    onSuccess: async () => {
      invalidateStepperInfoQueries()
      navigateForwardToStepper()
    },
    onError: (error: unknown) => {
      if (isApiError(error) && error.content?.code === 'TOO_MANY_VALIDATION_ATTEMPTS') {
        navigate(...getSubscriptionHookConfig('PhoneValidationTooManyAttempts'))
      } else {
        setErrorMessage(extractApiErrorMessage(error))
      }
    },
  })

  const onChangeValue = (value: string) => {
    setCodeInputState({
      code: value,
      isValid: !!value && hasCodeCorrectFormat(value),
    })
  }

  const validateCode = async () => {
    if (codeInputState.isValid) {
      setErrorMessage('')
      const { code } = codeInputState
      if (code) {
        validatePhoneNumber(code)
      }
    }
  }

  const enterCodeInstructions =
    formattedPhoneNumber === ''
      ? 'Saisis le code reçu par SMS.'
      : `Saisis le code reçu au ${formattedPhoneNumber}.`

  return (
    <PageWithHeader
      title="Numéro de téléphone"
      onGoBack={remainingAttempts === 0 ? goBackToPhoneValidationTooManySMSSent : undefined}
      scrollChildren={
        <Form.MaxWidth>
          <Typo.Title3 {...getHeadingAttrs(2)}>Valide ton numéro de téléphone</Typo.Title3>
          <Container>
            <StyledBody>{enterCodeInstructions}</StyledBody>
            <InputContainer>
              <InputText
                autoCapitalize="none"
                keyboardType="number-pad"
                label="Code de validation"
                format="Format&nbsp;: 6 chiffres"
                value={codeInputState.code}
                onChangeText={onChangeValue}
                placeholder="012345"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                onSubmitEditing={validateCode}
                accessibilityHint={errorMessage}
                testID="Entrée pour le code reçu par sms"
                errorMessage={errorMessage}
              />
            </InputContainer>
            <ButtonContainer>
              <ButtonTertiaryBlack
                inline
                icon={Again}
                wording="Code non reçu&nbsp;?"
                onPress={openMissingCodeModal}
              />
            </ButtonContainer>
            <CodeNotReceivedModal
              isVisible={isCodeNotReceivedModalVisible}
              dismissModal={hideModal}
            />
          </Container>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording="Continuer"
          isLoading={isLoading}
          disabled={!codeInputState.isValid}
          onPress={validateCode}
        />
      }
    />
  )
}

export const hasCodeCorrectFormat = (code: string) => {
  // exactly 6 digits, no spaces
  return !!code.match(/^\d{6}$/)
}

const Container = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const InputContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  marginHorizontal: theme.isMobileViewport ? undefined : 'auto',
  marginBottom: theme.designSystem.size.spacing.l,
}))

const ButtonContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
})
