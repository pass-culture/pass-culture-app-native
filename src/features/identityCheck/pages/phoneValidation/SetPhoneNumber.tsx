import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { Country, CountryCode } from 'react-native-country-picker-modal'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CountryPicker, METROPOLITAN_FRANCE } from 'features/auth/signup/PhoneValidation/components'
import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { useSafeState } from 'libs/hooks'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

const INITIAL_COUNTRY = METROPOLITAN_FRANCE

export const SetPhoneNumber = () => {
  const titleID = uuidv4()
  const [_phoneNumber, setPhoneNumber] = useState('')
  const [invalidPhoneNumberMessage, _setInvalidPhoneNumberMessage] = useSafeState('')
  const [country, setCountry] = useState<Country>(INITIAL_COUNTRY)

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

  const inputLabel = t`Numéro de téléphone`

  const LeftCountryPicker = <CountryPicker initialCountry={INITIAL_COUNTRY} onSelect={setCountry} />

  return (
    <PageWithHeader
      title={t`Profil`}
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
                label={inputLabel}
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

            <PhoneValidationTipsModal isVisible={isTipsModalVisible} dismissModal={hideTipsModal} />
          </View>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <BottomContentContainer>
          <Typo.Caption>{t`Attention, il te reste 5 demandes`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={2} />
          <ButtonPrimary
            type="submit"
            onPress={() => {
              // do nothing yet
            }}
            wording={t`Continuer`}
          />
        </BottomContentContainer>
      }
    />
  )
}

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
