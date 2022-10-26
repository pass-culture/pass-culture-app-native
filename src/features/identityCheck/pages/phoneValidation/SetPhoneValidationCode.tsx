import { CommonActions, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { CountryCode } from 'libphonenumber-js'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import {
  usePhoneValidationRemainingAttempts,
  useValidatePhoneNumberMutation,
} from 'features/identityCheck/api/api'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { CodeNotReceivedModal } from 'features/identityCheck/pages/phoneValidation/CodeNotReceivedModal'
import { formatPhoneNumberForDisplay } from 'features/identityCheck/pages/phoneValidation/utils'
import {
  IdentityCheckRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator'
import { amplitude } from 'libs/amplitude'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'
import { Again } from 'ui/svg/icons/Again'
import { Spacer, Typo } from 'ui/theme'

export type SetPhoneValidationCodeProps = StackScreenProps<
  IdentityCheckRootStackParamList,
  'SetPhoneValidationCode'
>

export const SetPhoneValidationCode = () => {
  const { phoneValidation } = useSubscriptionContext()
  const formattedPhoneNumber = phoneValidation?.phoneNumber
    ? formatPhoneNumberForDisplay(
        phoneValidation?.phoneNumber,
        phoneValidation?.country.countryCode as CountryCode
      )
    : ''
  const { navigate, dispatch } = useNavigation<UseNavigationType>()
  const { remainingAttempts } = usePhoneValidationRemainingAttempts()

  // We amend our navigation history to replace "SetPhoneNumber" with "PhoneValidationTooManySMSSent"
  const goBackToPhoneValidationTooManySMSSent = () => {
    dispatch((state) => {
      // Here we check the index of our 'IdentityCheckStepper' page in our navigation stack
      const stepperIndex = state.routes.findIndex((route) => route.name === 'IdentityCheckStepper')
      // Here we reset the routes parameter, taking all pages up to IdentityCheckStepper and adding 'PhoneValidationTooManySMSSent'
      // The ternary is used to prevent edge case crashes. stepperIndex could return -1 if we were brought to this page
      // without going through the stepper, e.g. through a deeplink.
      const routes =
        stepperIndex === -1
          ? [...state.routes, { name: 'PhoneValidationTooManySMSSent' }]
          : [...state.routes.slice(0, stepperIndex + 1), { name: 'PhoneValidationTooManySMSSent' }]
      // Here we reset the state AND navigate to the page whose index is given to the "index" parameter.
      // Therefore, we navigate to "PhoneValidationTooManySMSSent"
      return CommonActions.reset({ ...state, routes, index: routes.length - 1 })
    })
  }

  const [codeInputState, setCodeInputState] = useState({
    code: '',
    isValid: false,
  })
  const [errorMessage, setErrorMessage] = useState('')

  const titleID = uuidv4()
  const validationCodeInputErrorId = uuidv4()

  const { visible: isCodeNotReceivedModalVisible, hideModal, showModal } = useModal(false)

  const openMissingCodeModal = useCallback(() => {
    analytics.logHasClickedMissingCode()
    showModal()
  }, [showModal])

  const { mutate: validatePhoneNumber, isLoading } = useValidatePhoneNumberMutation({
    onSuccess: () => {
      navigate('IdentityCheckStepper')
    },
    onError: (err: unknown | ApiError) => {
      const { content } = err as ApiError
      if (content.code === 'TOO_MANY_VALIDATION_ATTEMPTS') {
        navigate('PhoneValidationTooManyAttempts')
      } else {
        setErrorMessage(extractApiErrorMessage(err))
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

    await amplitude.logEvent('young18_set_phone_validation_code_clicked_front')
  }

  const enterCodeInstructions =
    formattedPhoneNumber === ''
      ? 'Saisis le code reçu par SMS.'
      : `Saisis le code reçu au ${formattedPhoneNumber}.`

  return (
    <PageWithHeader
      title="Numéro de téléphone"
      onGoBack={remainingAttempts === 0 ? goBackToPhoneValidationTooManySMSSent : undefined}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle titleID={titleID} title="Valide ton numéro de téléphone" />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <View aria-labelledby={titleID}>
            <StyledBody>{enterCodeInstructions}</StyledBody>
            <Spacer.Column numberOfSpaces={6} />
            <InputContainer>
              <TextInput
                autoCapitalize="none"
                isError={false}
                keyboardType="number-pad"
                label="Code de validation"
                rightLabel="Format&nbsp;: 6 chiffres"
                value={codeInputState.code}
                onChangeText={onChangeValue}
                placeholder="012345"
                textContentType="oneTimeCode"
                onSubmitEditing={validateCode}
                accessibilityDescribedBy={validationCodeInputErrorId}
                testID="Entrée pour le code reçu par sms"
              />
            </InputContainer>
            <InputError
              visible={!!errorMessage}
              messageId={errorMessage}
              numberOfSpacesTop={3}
              relatedInputId={validationCodeInputErrorId}
            />
            <Spacer.Column numberOfSpaces={4} />
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
          </View>
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

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))

const InputContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  marginHorizontal: theme.isMobileViewport ? undefined : 'auto',
}))

const ButtonContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-end',
})
