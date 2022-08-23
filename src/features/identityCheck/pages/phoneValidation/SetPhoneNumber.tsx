import { plural, t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Country, CountryCode } from 'react-native-country-picker-modal'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import {
  usePhoneValidationRemainingAttempts,
  useSendPhoneValidationMutation,
} from 'features/identityCheck/api/api'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { CountryPicker, METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/utils'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { amplitude } from 'libs/amplitude'
import { useSafeState } from 'libs/hooks'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const INITIAL_COUNTRY = METROPOLITAN_FRANCE

export const SetPhoneNumber = () => {
  const titleID = uuidv4()
  const { dispatch, phoneValidation } = useIdentityCheckContext()
  const [phoneNumber, setPhoneNumber] = useState(phoneValidation?.phoneNumber ?? '')
  const [invalidPhoneNumberMessage, setInvalidPhoneNumberMessage] = useSafeState('')
  const [country, setCountry] = useState<Country>(INITIAL_COUNTRY)
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavConfig)
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const isContinueButtonEnabled = Boolean(isPhoneNumberValid(phoneNumber, country.cca2))

  const { remainingAttempts, isLastAttempt } = usePhoneValidationRemainingAttempts()

  const requestsWording = plural(remainingAttempts ?? 0, {
    one: '# demande',
    other: '# demandes',
  })

  const {
    visible: isTipsModalVisible,
    showModal: showTipsModal,
    hideModal: hideTipsModal,
  } = useModal(true)
  const phoneNumberInputErrorId = uuidv4()

  useEffect(() => {
    showTipsModal()
  }, [showTipsModal])

  function onChangeText(value: string) {
    setPhoneNumber(value)
  }

  const { mutate: sendPhoneValidationCode, isLoading } = useSendPhoneValidationMutation({
    onSuccess: () => {
      dispatch({
        type: 'SET_PHONE_NUMBER',
        payload: {
          phoneNumber,
          country: { countryCode: country.cca2, callingCodes: country.callingCode },
        },
      })
      navigateToNextScreen()
      queryClient.invalidateQueries(QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS)
    },
    onError: (error: ApiError | unknown) => {
      dispatch({
        type: 'SET_PHONE_NUMBER',
        payload: {
          phoneNumber,
          country: { countryCode: country.cca2, callingCodes: country.callingCode },
        },
      })
      const { content } = error as ApiError
      if (content.code === 'TOO_MANY_SMS_SENT') {
        navigate('PhoneValidationTooManySMSSent')
      } else {
        const message = extractApiErrorMessage(error)
        setInvalidPhoneNumberMessage(message)
      }
    },
  })

  async function requestSendPhoneValidationCode() {
    const callingCode = country.callingCode[0]
    if (isContinueButtonEnabled && callingCode) {
      setInvalidPhoneNumberMessage('')
      const phoneNumberWithPrefix = formatPhoneNumberWithPrefix(phoneNumber, callingCode)
      sendPhoneValidationCode(phoneNumberWithPrefix)
    }

    await amplitude().logEvent('young18_set_phone_number_clicked_front')
  }

  const LeftCountryPicker = <CountryPicker initialCountry={INITIAL_COUNTRY} onSelect={setCountry} />

  return (
    <PageWithHeader
      title={t`Numéro de téléphone`}
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle titleID={titleID} title={t`Ton numéro de téléphone`} />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <View aria-labelledby={titleID}>
            <StyledBody>{t`Tu vas recevoir un code de validation pour confirmer ton numéro.`}</StyledBody>
            <Spacer.Column numberOfSpaces={6} />
            <InputContainer>
              <TextInput
                autoComplete="off" // disable autofill on android
                autoCapitalize="none"
                isError={false}
                keyboardType="number-pad"
                label={t`Numéro de téléphone`}
                value={phoneNumber}
                onChangeText={onChangeText}
                textContentType="none" // disable autofill on iOS
                onSubmitEditing={requestSendPhoneValidationCode}
                accessibilityDescribedBy={phoneNumberInputErrorId}
                leftComponent={LeftCountryPicker}
                testID={t`Entrée pour le numéro de téléphone`}
              />
            </InputContainer>
            <InputError
              relatedInputId={phoneNumberInputErrorId}
              visible={!!invalidPhoneNumberMessage}
              messageId={invalidPhoneNumberMessage}
              numberOfSpacesTop={3}
            />
            {invalidPhoneNumberMessage ? (
              <Spacer.Column numberOfSpaces={5} />
            ) : (
              <Spacer.Column numberOfSpaces={8} />
            )}

            <PhoneValidationTipsModal
              isVisible={isTipsModalVisible}
              dismissModal={hideTipsModal}
              onGoBack={goBack}
            />
          </View>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <BottomContentContainer>
          <RemainingAttemptsContainer>
            <GreyDarkCaption>{t`Il te reste` + ' '}</GreyDarkCaption>
            <WarningRemainingAttempts isLastAttempt={isLastAttempt}>
              {requestsWording + ' '}
            </WarningRemainingAttempts>
            <GreyDarkCaption>{t`de code de validation`}</GreyDarkCaption>
          </RemainingAttemptsContainer>
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            type="submit"
            onPress={requestSendPhoneValidationCode}
            wording={t`Continuer`}
            disabled={!isContinueButtonEnabled}
            isLoading={isLoading}
          />
        </BottomContentContainer>
      }
    />
  )
}

function isPhoneNumberValid(number: string, countryCode: CountryCode) {
  if (countryCode === 'NC') {
    // 6 digits that can be separated by whitespace, "." or "-".
    return number.match(/^\d{3}(?:[\s.-]*)\d{3}$/)
  }
  // 9 digits, 10 if the first is a "0" that can be separated by whitespace, "." or "-".
  return number.match(/^(?:0)?\s*[1-9](?:[\s.-]*\d{2}){4}$/)
}

const RemainingAttemptsContainer = styled.View({
  flexDirection: 'row',
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))

const BottomContentContainer = styled.View({
  alignItems: 'center',
})

const InputContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  marginHorizontal: theme.isMobileViewport ? undefined : 'auto',
}))

const WarningRemainingAttempts = styled(Typo.Caption)<{ isLastAttempt: boolean }>(
  ({ theme, isLastAttempt }) => ({
    color: isLastAttempt ? theme.colors.error : theme.colors.black,
  })
)
