import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputLabel } from 'ui/components/InputLabel'
import { CheckboxInput } from 'ui/components/inputs/CheckboxInput'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { padding, Spacer, Typo } from 'ui/theme'
import { Form } from 'ui/web/form/Form'
import { HiddenCheckbox } from 'ui/web/inputs/HiddenCheckbox'

import { PreValidationSignupStepProps } from '../types'

export const SetEmail: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const [email, setEmail] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false)
  const emailInputErrorId = uuidv4()
  const shouldDisableValidateButton = isValueEmpty(email)

  const emailInput = useRef<RNTextInput | null>(null)
  const checkboxID = uuidv4()

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

  function onCheckboxPress() {
    setIsNewsletterChecked((prevIsNewsletterChecked) => !prevIsNewsletterChecked)
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
        accessibilityDescribedBy={emailInputErrorId}
      />
      <InputError
        visible={hasError}
        messageId={t`L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr`}
        numberOfSpacesTop={2}
        relatedInputId={emailInputErrorId}
      />
      <Spacer.Column numberOfSpaces={4} />
      <StyledCheckBox
        onPress={onCheckboxPress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isNewsletterChecked }}>
        <CheckboxInput
          isChecked={isNewsletterChecked}
          setIsChecked={setIsNewsletterChecked}
          accessible={false}
        />
        <CheckBoxText>
          <InputLabel htmlFor={checkboxID}>
            {t`J’accepte de recevoir les newsletters, bons plans et recommandations personnalisées du pass Culture.`}
          </InputLabel>
        </CheckBoxText>
        <HiddenCheckbox
          id={checkboxID}
          name="email"
          checked={isNewsletterChecked}
          accessibilityLabel={t`J’accepte de recevoir les newsletters, bons plans et recommandations personnalisées du pass Culture.`}
          onChange={onCheckboxPress}
        />
      </StyledCheckBox>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording={t`Continuer`}
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
