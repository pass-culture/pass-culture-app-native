import React, { FunctionComponent, useCallback, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

import { PreValidationSignupStepProps } from '../types'

export const SetEmail: FunctionComponent<PreValidationSignupStepProps> = (props) => {
  const [email, setEmail] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false)
  const emailInputErrorId = uuidv4()
  const shouldDisableValidateButton = isValueEmpty(email)

  const emailInput = useRef<RNTextInput | null>(null)

  function onEmailChange(newEmailInput: string) {
    if (hasError) {
      setHasError(false)
    }
    setEmail(newEmailInput)
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

  const onLogAnalytics = useCallback(() => {
    analytics.logLogin({ method: 'fromSetEmail' })
  }, [])

  const checkBoxlabel =
    'J’accepte de recevoir les newsletters, bons plans et recommandations personnalisées du pass Culture.'

  return (
    <Form.MaxWidth>
      <EmailInput
        label="Adresse e-mail"
        email={email}
        onEmailChange={onEmailChange}
        autoFocus
        onSubmitEditing={validateEmail}
        ref={emailInput}
        accessibilityDescribedBy={emailInputErrorId}
      />
      <InputError
        visible={hasError}
        messageId="L’e-mail renseigné est incorrect. Exemple de format attendu&nbsp;: edith.piaf@email.fr"
        numberOfSpacesTop={2}
        relatedInputId={emailInputErrorId}
      />
      <Spacer.Column numberOfSpaces={4} />
      <Checkbox isChecked={isNewsletterChecked} label={checkBoxlabel} onPress={onCheckboxPress} />
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Continuer"
        accessibilityLabel={props.accessibilityLabelForNextStep}
        onPress={validateEmail}
        isLoading={false}
        disabled={shouldDisableValidateButton}
      />
      <Spacer.Column numberOfSpaces={8} />
      <AuthenticationButton type="login" onAdditionalPress={onLogAnalytics} />
      <Spacer.Column numberOfSpaces={4} />
    </Form.MaxWidth>
  )
}
