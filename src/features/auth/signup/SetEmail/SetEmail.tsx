import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { CheckboxInput } from 'ui/components/inputs/CheckboxInput'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { padding, Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'

import { PreValidationSignupStepProps } from '../types'

export const SetEmail: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const [email, setEmail] = useState('')
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
    <Form.MaxWidth>
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
        messageId={t`L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr`}
        numberOfSpacesTop={2}
      />
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
        accessibilityLabel={props.accessibilityLabelForNextStep}
        onPress={validateEmail}
        isLoading={false}
        disabled={shouldDisableValidateButton}
      />
      <Spacer.Column numberOfSpaces={5} />
    </Form.MaxWidth>
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
