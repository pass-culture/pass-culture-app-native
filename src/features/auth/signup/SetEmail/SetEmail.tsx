import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { env } from 'libs/environment'
import { randomAlphaString } from 'libs/random'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { CheckboxInput } from 'ui/components/inputs/CheckboxInput'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { InputError } from 'ui/components/inputs/InputError'
import { padding, Spacer, Typo } from 'ui/theme'

import { PreValidationSignupStepProps } from '../types'

let INITIAL_EMAIL = ''

if (__DEV__ && env.SIGNUP_RANDOM_EMAIL) {
  INITIAL_EMAIL = `${randomAlphaString()}@${randomAlphaString()}.com`
}

export const SetEmail: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const [email, setEmail] = useState(INITIAL_EMAIL)
  const [hasError, setHasError] = useState(false)
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false)

  const shouldDisableValidateButton = isValueEmpty(email)

  const emailInput = useRef<RNTextInput | null>(null)

  function onEmailChange(email: string) {
    if (hasError) {
      setHasError(false)
    }
    setEmail(email)
  }

  function validateEmail() {
    if (isEmailValid(email)) {
      props.goToNextStep({ email, marketingEmailSubscription: isNewsletterChecked })
    } else {
      setHasError(true)
    }
  }

  return (
    <React.Fragment>
      <InputContainer>
        <EmailInput
          label={t`Adresse e-mail`}
          email={email}
          onEmailChange={onEmailChange}
          autoFocus={true}
          onSubmitEditing={validateEmail}
          ref={emailInput}
        />
        <InputError
          visible={hasError}
          messageId={t`Format de l'e-mail incorrect`}
          numberOfSpacesTop={1}
        />
      </InputContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledCheckBox
        onPress={() =>
          setIsNewsletterChecked((prevIsNewsletterChecked) => !prevIsNewsletterChecked)
        }>
        <CheckboxInput isChecked={isNewsletterChecked} setIsChecked={setIsNewsletterChecked} />
        <CheckBoxText>{t`J’accepte de recevoir les e-mails du pass Culture.`}</CheckBoxText>
      </StyledCheckBox>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        title={t`Continuer`}
        onPress={validateEmail}
        isLoading={false}
        disabled={shouldDisableValidateButton}
      />
      <Spacer.Column numberOfSpaces={5} />
    </React.Fragment>
  )
}

const CheckBoxText = styled(Typo.Body)({
  alignSelf: 'center',
  ...padding(0, 8, 0, 4),
})

const StyledCheckBox = styled.TouchableOpacity({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
})
