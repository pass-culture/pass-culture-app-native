import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { extractApiErrorMessage, isApiError } from 'api/apiHelpers'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { useSendPhoneValidationMutation } from 'features/identityCheck/api/useSendPhoneValidationMutation'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker/constants'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { Country } from 'features/identityCheck/components/countryPicker/types'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import { isPhoneNumberValid } from 'features/identityCheck/pages/phoneValidation/helpers/isPhoneNumberValid'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
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
    analytics.logScreenViewSetPhoneNumber()
  }, [])
  const titleID = uuidv4()
  const { dispatch, phoneValidation } = useSubscriptionContext()
  const [phoneNumber, setPhoneNumber] = useState(phoneValidation?.phoneNumber ?? '')
  const [invalidPhoneNumberMessage, setInvalidPhoneNumberMessage] = useSafeState('')
  const [country, setCountry] = useState<Country>(INITIAL_COUNTRY)
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavConfig)
  const isContinueButtonEnabled = isPhoneNumberValid(phoneNumber)
  const saveStep = useSaveStep()

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
          country: { countryCode: country.id, callingCode: country.callingCode },
        },
      })
      saveStep(IdentityCheckStep.PHONE_VALIDATION)
      navigate('SetPhoneValidationCode')
      queryClient.invalidateQueries([QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS])
    },
    onError: (error: unknown) => {
      dispatch({
        type: 'SET_PHONE_NUMBER',
        payload: {
          phoneNumber,
          country: { countryCode: country.id, callingCode: country.callingCode },
        },
      })
      if (isApiError(error) && error.content?.code === 'TOO_MANY_SMS_SENT') {
        navigate('PhoneValidationTooManySMSSent')
      } else {
        const message = extractApiErrorMessage(error)
        setInvalidPhoneNumberMessage(message)
      }
    },
  })

  async function requestSendPhoneValidationCode() {
    analytics.logHasRequestedCode()
    if (isContinueButtonEnabled) {
      setInvalidPhoneNumberMessage('')
      const phoneNumberWithPrefix = formatPhoneNumberWithPrefix(phoneNumber, country.callingCode)
      sendPhoneValidationCode(phoneNumberWithPrefix)
    }

    analytics.logPhoneNumberClicked()
  }

  return (
    <PageWithHeader
      title="Numéro de téléphone"
      scrollChildren={
        <React.Fragment>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredTitle titleID={titleID} title="Quel est ton numéro de téléphone&nbsp;?" />
          <Spacer.Column numberOfSpaces={6} />
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
                  leftComponent={<CountryPicker selectedCountry={country} onSelect={setCountry} />}
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
        </React.Fragment>
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
