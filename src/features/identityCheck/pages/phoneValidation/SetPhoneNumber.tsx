import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Country } from 'react-native-country-picker-modal'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { useSendPhoneValidationMutation } from 'features/identityCheck/api/useSendPhoneValidationMutation'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker/constants'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSubscriptionNavigation } from 'features/identityCheck/pages/helpers/useSubscriptionNavigation'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import { isPhoneNumberValid } from 'features/identityCheck/pages/phoneValidation/helpers/isPhoneNumberValid'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { amplitude } from 'libs/amplitude'
import { analytics } from 'libs/firebase/analytics'
import { useSafeState } from 'libs/hooks'
import { plural } from 'libs/plural'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer, Typo } from 'ui/theme'

const INITIAL_COUNTRY = METROPOLITAN_FRANCE

export const SetPhoneNumber = () => {
  useEffect(() => {
    amplitude.logEvent('screen_view_set_phone_number')
  }, [])
  const titleID = uuidv4()
  const { dispatch, phoneValidation } = useSubscriptionContext()
  const [phoneNumber, setPhoneNumber] = useState(phoneValidation?.phoneNumber ?? '')
  const [invalidPhoneNumberMessage, setInvalidPhoneNumberMessage] = useSafeState('')
  const [country, setCountry] = useState<Country>(INITIAL_COUNTRY)
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavConfig)
  const { navigateToNextScreen } = useSubscriptionNavigation()
  const isContinueButtonEnabled = isPhoneNumberValid(phoneNumber)

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
    analytics.logHasRequestedCode()
    const callingCode = country.callingCode[0]
    if (isContinueButtonEnabled && callingCode) {
      setInvalidPhoneNumberMessage('')
      const phoneNumberWithPrefix = formatPhoneNumberWithPrefix(phoneNumber, callingCode)
      sendPhoneValidationCode(phoneNumberWithPrefix)
    }

    amplitude.logEvent('phone_number_clicked')
  }

  const LeftCountryPicker = <CountryPicker initialCountry={INITIAL_COUNTRY} onSelect={setCountry} />

  return (
    <PageWithHeader
      title="Numéro de téléphone"
      fixedTopChildren={
        <React.Fragment>
          <CenteredTitle titleID={titleID} title="Ton numéro de téléphone" />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      }
      scrollChildren={
        <Form.MaxWidth>
          <View accessibilityLabelledBy={titleID}>
            <StyledBody>
              Tu vas recevoir un code de validation pour confirmer ton numéro.
            </StyledBody>
            <Spacer.Column numberOfSpaces={6} />
            <InputContainer>
              <TextInput
                autoComplete="off" // disable autofill on android
                autoCapitalize="none"
                isError={false}
                keyboardType="number-pad"
                label="Numéro de téléphone"
                value={phoneNumber}
                onChangeText={onChangeText}
                textContentType="none" // disable autofill on iOS
                onSubmitEditing={requestSendPhoneValidationCode}
                accessibilityDescribedBy={phoneNumberInputErrorId}
                leftComponent={LeftCountryPicker}
                testID="Entrée pour le numéro de téléphone"
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
            <Typo.CaptionNeutralInfo>Il te reste </Typo.CaptionNeutralInfo>
            <WarningRemainingAttempts isLastAttempt={isLastAttempt}>
              {requestsWording + ' '}
            </WarningRemainingAttempts>
            <Typo.CaptionNeutralInfo>de code de validation</Typo.CaptionNeutralInfo>
          </RemainingAttemptsContainer>
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            type="submit"
            onPress={requestSendPhoneValidationCode}
            wording="Continuer"
            disabled={!isContinueButtonEnabled}
            isLoading={isLoading}
          />
        </BottomContentContainer>
      }
    />
  )
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
