import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { REDACTOR_SIGNUP_NUMBER_OF_STEPS } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { SetEmailModalContent, StyledInput } from 'features/auth/components/signupComponents'
import { useBackNavigation } from 'features/navigation/backNavigation'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { testID } from 'tests/utils'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

export const SetRedactorEmail: FunctionComponent = () => {
  const [email, setEmail] = useState('')
  const [hasError, setHasError] = useState(false)

  const navigation = useNavigation<UseNavigationType>()

  const emailInput = useRef<RNTextInput | null>(null)

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  const complexGoBack = useBackNavigation()

  function onChangeEmail(email: string) {
    if (hasError) {
      setHasError(false)
    }
    setEmail(email)
  }

  async function validateEmail() {
    if (isEmailValid(email)) {
      navigation.navigate(`SetRedactorPassword`, { email })
    } else {
      setHasError(true)
    }
  }

  function showQuitSignupModal() {
    emailInput.current && emailInput.current.blur()
    showFullPageModal()
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Votre e-mail`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={complexGoBack}
          rightIcon={Close}
          onRightIconPress={showQuitSignupModal}
        />
        <SetEmailModalContent>
          <StyledInput>
            <Typo.Body>{t`Adresse e-mail`}</Typo.Body>
            <Spacer.Column numberOfSpaces={2} />
            <TextInput
              autoCapitalize="none"
              autoFocus={true}
              keyboardType="email-address"
              onChangeText={onChangeEmail}
              placeholder={t`votreadresse@email.com`}
              ref={emailInput}
              textContentType="emailAddress"
              value={email}
              {...testID("Entrée pour l'email")}
            />
            <InputError
              visible={hasError}
              messageId={t`Format de l'e-mail incorrect`}
              numberOfSpacesTop={1}
            />
          </StyledInput>
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            title={t`Continuer`}
            onPress={validateEmail}
            isLoading={false}
            disabled={isValueEmpty(email)}
          />
          <Spacer.Column numberOfSpaces={5} />
          <StepDots numberOfSteps={REDACTOR_SIGNUP_NUMBER_OF_STEPS} currentStep={1} />
        </SetEmailModalContent>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="email-quit-signup"
        signupStep={SignupSteps.RedactorEmail}
        isRedactor={true}
      />
    </React.Fragment>
  )
}
