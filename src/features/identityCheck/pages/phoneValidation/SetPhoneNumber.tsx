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
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/accessibilityRoleInternalNavigation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
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

  const { mutate: sendPhoneValidationCode, isPending } = useSendPhoneValidationMutation({
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
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PHONE_VALIDATION_REMAINING_ATTEMPTS] })
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
          <StyledTitle3 {...getHeadingAttrs(2)}>
            Quel est ton numéro de téléphone&nbsp;?
          </StyledTitle3>
          <Form.MaxWidth>
            <View>
              <StyledBody>
                Tu vas recevoir un code de validation pour confirmer ton numéro.
              </StyledBody>
              <InputContainer invalidPhoneNumberMessage={invalidPhoneNumberMessage}>
                <InputText
                  autoComplete="tel"
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  label="Numéro de téléphone"
                  value={phoneNumber}
                  onChangeText={onChangeText}
                  textContentType="telephoneNumber"
                  onSubmitEditing={requestSendPhoneValidationCode}
                  accessibilityHint={invalidPhoneNumberMessage}
                  leftComponent={<CountryPicker selectedCountry={country} onSelect={setCountry} />}
                  testID="Entrée pour le numéro de téléphone"
                  errorMessage={invalidPhoneNumberMessage}
                />
              </InputContainer>

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
        <BottomContentContainer gap={2}>
          <RemainingAttemptsContainer>
            <StyledBodyAccentXs>Il te reste </StyledBodyAccentXs>
            <WarningRemainingAttempts isLastAttempt={isLastAttempt}>
              {requestsWording + ' '}
            </WarningRemainingAttempts>
            <StyledBodyAccentXs>de code de validation</StyledBodyAccentXs>
          </RemainingAttemptsContainer>
          <ButtonPrimary
            type="submit"
            onPress={requestSendPhoneValidationCode}
            wording="Continuer"
            accessibilityRole={accessibilityRoleInternalNavigation()}
            accessibilityLabel="Continuer vers l’étape suivante"
            disabled={!isContinueButtonEnabled}
            isLoading={isPending}
          />
        </BottomContentContainer>
      }
    />
  )
}

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const RemainingAttemptsContainer = styled.View({
  flexDirection: 'row',
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const BottomContentContainer = styled(ViewGap)({
  alignItems: 'center',
})

const InputContainer = styled.View<{ invalidPhoneNumberMessage: string }>(
  ({ theme, invalidPhoneNumberMessage }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginHorizontal: theme.isMobileViewport ? undefined : 'auto',
    marginBottom: invalidPhoneNumberMessage
      ? theme.designSystem.size.spacing.l
      : theme.designSystem.size.spacing.xxl,
  })
)

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
