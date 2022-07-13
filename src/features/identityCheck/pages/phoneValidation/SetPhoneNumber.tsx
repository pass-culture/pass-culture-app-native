import { plural, t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { Country, CountryCode } from 'react-native-country-picker-modal'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ApiError, extractApiErrorMessage } from 'api/apiHelpers'
import { CountryPicker, METROPOLITAN_FRANCE } from 'features/auth/signup/PhoneValidation/components'
import {
  usePhoneValidationRemainingAttempts,
  useSendPhoneValidationMutation,
} from 'features/identityCheck/api/api'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { amplitude } from 'libs/amplitude'
import { useSafeState } from 'libs/hooks'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const INITIAL_COUNTRY = METROPOLITAN_FRANCE

export const SetPhoneNumber = () => {
  const titleID = uuidv4()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [invalidPhoneNumberMessage, setInvalidPhoneNumberMessage] = useSafeState('')
  const [country, setCountry] = useState<Country>(INITIAL_COUNTRY)
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...homeNavConfig)
  const isContinueButtonEnabled = Boolean(isPhoneNumberValid(phoneNumber))

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

  useFocusEffect(
    useCallback(() => {
      showTipsModal()
    }, [showTipsModal])
  )

  function onChangeText(value: string) {
    setPhoneNumber(value)
  }

  function getPlaceholder(countryCode: CountryCode): string {
    if (countryCode === 'NC') return '654 321'
    return '06 12 34 56 78'
  }

  const { mutate: sendPhoneValidationCode, isLoading } = useSendPhoneValidationMutation({
    onSuccess: () => {
      navigate('SetPhoneValidationCode', { phoneNumber, countryCode: country.cca2 })
      queryClient.invalidateQueries(QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS)
    },
    onError: (error: ApiError | unknown) => {
      const { content } = error as ApiError
      if (content.code === 'TOO_MANY_SMS_SENT') {
        navigate('PhoneValidationTooManySMSSent', { phoneNumber, countryCode: country.cca2 })
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
      const phoneNumberWithPrefix = `+${callingCode}${formatPhoneNumber(phoneNumber)}`
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
                autoCapitalize="none"
                isError={false}
                keyboardType="number-pad"
                label={t`Numéro de téléphone`}
                onChangeText={onChangeText}
                placeholder={getPlaceholder(country.cca2)}
                textContentType="telephoneNumber"
                onSubmitEditing={() => {
                  // do nothing yet
                }}
                accessibilityDescribedBy={phoneNumberInputErrorId}
                leftComponent={LeftCountryPicker}
                {...accessibilityAndTestId(t`Entrée pour le numéro de téléphone`)}
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
            <GreyCaption>{t`Il te reste` + ' '}</GreyCaption>
            <WarningRemainingAttempts isLastAttempt={isLastAttempt}>
              {requestsWording + ' '}
            </WarningRemainingAttempts>
            <GreyCaption>{t`de code de validation`}</GreyCaption>
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

/**
 * 6 to 10 digits
 */
function isPhoneNumberValid(word: string) {
  return word.match(/^\d{6,10}$/)
}

function formatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.startsWith('0')) {
    return phoneNumber.substring(1)
  }
  return phoneNumber
}

const RemainingAttemptsContainer = styled.View({
  flexDirection: 'row',
})

const GreyCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

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
