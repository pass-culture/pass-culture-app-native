import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'
import React, { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { IdentityCheckRootStackParamList } from 'features/navigation/RootNavigator'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Again } from 'ui/svg/icons/Again'
import { Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

type SetPhoneValidationCodeProps = StackScreenProps<
  IdentityCheckRootStackParamList,
  'SetPhoneValidationCode'
>

export const SetPhoneValidationCode = ({ route }: SetPhoneValidationCodeProps) => {
  const [_codeInput, setCodeInput] = useState('')
  const formattedPhoneNumber = formatPhoneNumber(
    route.params.phoneNumber,
    route.params.countryCode as CountryCode
  )
  const titleID = uuidv4()
  const validationCodeInputErrorId = uuidv4()

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
                onChangeText={setCodeInput}
                placeholder={'012345'}
                textContentType="oneTimeCode"
                onSubmitEditing={() => {
                  // do nothing yet
                }}
                accessibilityDescribedBy={validationCodeInputErrorId}
                {...accessibilityAndTestId(t`Entrée pour le code reçu par sms`)}
              />
            </InputContainer>
            <Spacer.Column numberOfSpaces={4} />
            <ButtonContainer>
              <ButtonTertiaryBlack
                inline
                icon={Again}
                wording={t`Code non reçu\u00a0?`}
                onPress={() => {
                  // do nothing yet
                }}
              />
            </ButtonContainer>
          </View>
        </Form.MaxWidth>
      }
      fixedBottomChildren={<ButtonPrimary type="submit" wording={t`Continuer`} />}
    />
  )
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
