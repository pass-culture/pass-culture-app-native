import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import { useValidatePhoneNumberMutation } from 'features/identityCheck/api/api'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { CodeNotReceivedModal } from 'features/identityCheck/pages/phoneValidation/CodeNotReceivedModal'
import {
  IdentityCheckRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { amplitude } from 'libs/amplitude'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'
import { Again } from 'ui/svg/icons/Again'
import { Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

export type SetPhoneValidationCodeProps = StackScreenProps<
  IdentityCheckRootStackParamList,
  'SetPhoneValidationCode'
>

export const SetPhoneValidationCode = () => {
  const { phoneValidation } = useIdentityCheckContext()
  const formattedPhoneNumber = phoneValidation?.phoneNumber
    ? formatPhoneNumber(phoneValidation?.phoneNumber, phoneValidation?.countryCode as CountryCode)
    : ''
  const { navigate } = useNavigation<UseNavigationType>()

  useFocusEffect(
    useCallback(() => {
      if (!phoneValidation) {
        setTimeout(() => navigate('SetPhoneNumber'))
      }
    }, [phoneValidation, navigate])
  )

  const [codeInputState, setCodeInputState] = useState({
    code: '',
    isValid: false,
  })
  const [errorMessage, setErrorMessage] = useState('')

  const titleID = uuidv4()
  const validationCodeInputErrorId = uuidv4()

  const { visible: isCodeNotReceivedModalVisible, hideModal, showModal } = useModal(false)

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

    await amplitude().logEvent('young18_set_phone_validation_code_clicked_front')
  }

  return (
    <PageWithHeader
      title={t`Numéro de téléphone`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle titleID={titleID} title={t`Valide ton numéro de téléphone`} />
          <Spacer.Column numberOfSpaces={5} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <View aria-labelledby={titleID}>
            <StyledBody>{t`Saisis le code reçu au` + ` ${formattedPhoneNumber}.`}</StyledBody>
            <Spacer.Column numberOfSpaces={6} />
            <InputContainer>
              <TextInput
                autoCapitalize="none"
                isError={false}
                keyboardType="number-pad"
                label={t`Code de validation`}
                rightLabel={t`Format\u00a0: 6 chiffres`}
                onChangeText={onChangeValue}
                placeholder={'012345'}
                textContentType="oneTimeCode"
                onSubmitEditing={validateCode}
                accessibilityDescribedBy={validationCodeInputErrorId}
                {...accessibilityAndTestId(t`Entrée pour le code reçu par sms`)}
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
                wording={t`Code non reçu\u00a0?`}
                onPress={showModal}
              />
            </ButtonContainer>
            <CodeNotReceivedModal
              isVisible={isCodeNotReceivedModalVisible}
              dismissModal={hideModal}
              phoneNumber={formattedPhoneNumber}
            />
          </View>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording={t`Continuer`}
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

// returns a formatted phone number like +33 X XX XX XX XX with unbreakable spaces
export const formatPhoneNumber = (phoneNumber: string, countryCode: CountryCode) => {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber, countryCode)
  return parsedPhoneNumber?.formatInternational().replace(/ /g, '\u00a0') || ''
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
