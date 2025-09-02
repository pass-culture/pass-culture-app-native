import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { extractApiErrorMessage, isApiError } from 'api/apiHelpers'
import { METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker/constants'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { Country } from 'features/identityCheck/components/countryPicker/types'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import { isPhoneNumberValid } from 'features/identityCheck/pages/phoneValidation/helpers/isPhoneNumberValid'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { usePhoneValidationRemainingAttemptsQuery } from 'features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery'
import { useSendPhoneValidationMutation } from 'features/identityCheck/queries/useSendPhoneValidationMutation'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { useSafeState } from 'libs/hooks'
import { plural } from 'libs/plural'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const INITIAL_COUNTRY = METROPOLITAN_FRANCE

export const SetPhoneNumber = () => {
  const { dispatch, phoneValidation } = useSubscriptionContext()
  const [phoneNumber, setPhoneNumber] = useState(phoneValidation?.phoneNumber ?? '')
  const [invalidPhoneNumberMessage, setInvalidPhoneNumberMessage] = useSafeState('')
  const [country, setCountry] = useState<Country>(INITIAL_COUNTRY)
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavigationConfig)
  const isContinueButtonEnabled = isPhoneNumberValid(phoneNumber, country.id)
  const saveStep = useSaveStep()

  const { remainingAttempts, isLastAttempt } = usePhoneValidationRemainingAttemptsQuery()

  const requestsWording = plural(remainingAttempts ?? 0, {
    singular: '# demande',
    plural: '# demandes',
  })

  const {
    visible: isTipsModalVisible,
    showModal: showTipsModal,
    hideModal: hideTipsModal,
  } = useModal(true)

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
      navigate(...getSubscriptionHookConfig('SetPhoneValidationCode'))
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
        navigate(...getSubscriptionHookConfig('PhoneValidationTooManySMSSent'))
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
  }

  return (
    <PageWithHeader
      title="Numéro de téléphone"
      scrollChildren={
        <React.Fragment>
          <Typo.Title3 {...getHeadingAttrs(2)}>Quel est ton numéro de téléphone&nbsp;?</Typo.Title3>
          <Spacer.Column numberOfSpaces={6} />
          <Form.MaxWidth>
            <View>
              <StyledBody>
                Tu vas recevoir un code de validation pour confirmer ton numéro.
              </StyledBody>
              <Spacer.Column numberOfSpaces={6} />
              <InputContainer>
                <TextInput
                  autoComplete="tel"
                  autoCapitalize="none"
                  isError={false}
                  keyboardType="number-pad"
                  label="Numéro de téléphone"
                  value={phoneNumber}
                  onChangeText={onChangeText}
                  textContentType="telephoneNumber"
                  onSubmitEditing={requestSendPhoneValidationCode}
                  accessibilityHint={invalidPhoneNumberMessage}
                  leftComponent={<CountryPicker selectedCountry={country} onSelect={setCountry} />}
                  testID="Entrée pour le numéro de téléphone"
                />
              </InputContainer>
              <InputError
                visible={!!invalidPhoneNumberMessage}
                errorMessage={invalidPhoneNumberMessage}
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
            <StyledBodyAccentXs>Il te reste </StyledBodyAccentXs>
            <WarningRemainingAttempts isLastAttempt={isLastAttempt}>
              {requestsWording + ' '}
            </WarningRemainingAttempts>
            <StyledBodyAccentXs>de code de validation</StyledBodyAccentXs>
          </RemainingAttemptsContainer>
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            type="submit"
            onPress={requestSendPhoneValidationCode}
            wording="Continuer"
            accessibilityLabel="Continuer vers l’étape suivante"
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
  color: theme.designSystem.color.text.subtle,
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

const WarningRemainingAttempts = styled(Typo.BodyAccentXs)<{ isLastAttempt: boolean }>(
  ({ theme, isLastAttempt }) => ({
    color: isLastAttempt
      ? theme.designSystem.color.text.error
      : theme.designSystem.color.text.default,
  })
)

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
