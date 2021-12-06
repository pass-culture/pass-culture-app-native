import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { SIGNUP_NUMBER_OF_STEPS } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { SetEmailModalContent } from 'features/auth/components/signupComponents'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { randomAlphaString } from 'libs/random'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { CheckboxInput } from 'ui/components/inputs/CheckboxInput'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { EmailInput } from 'ui/components/inputs/EmailInput'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { InputError } from 'ui/components/inputs/InputError'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { padding, Spacer, Typo } from 'ui/theme'

let INITIAL_EMAIL = ''

if (__DEV__ && env.SIGNUP_RANDOM_EMAIL) {
  INITIAL_EMAIL = `${randomAlphaString()}@${randomAlphaString()}.com`
}

export const SetEmail: FunctionComponent = () => {
  const [email, setEmail] = useState(INITIAL_EMAIL)
  const [hasError, setHasError] = useState(false)
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false)

  const { params } = useRoute<UseRouteType<'SetEmail'>>()
  const navigation = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const shouldDisableValidateButton = isValueEmpty(email)

  const emailInput = useRef<RNTextInput | null>(null)

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function onEmailChange(email: string) {
    if (hasError) {
      setHasError(false)
    }
    setEmail(email)
  }

  async function validateEmail() {
    if (isEmailValid(email)) {
      navigation.navigate(`SetPassword`, { email, isNewsletterChecked })
    } else {
      setHasError(true)
    }
  }

  function showQuitSignupModal() {
    emailInput.current && emailInput.current.blur()
    showFullPageModal()
  }

  const rightIconProps = params?.preventCancellation
    ? {
        rightIconAccessibilityLabel: undefined,
        rightIcon: undefined,
        onRightIconPress: undefined,
      }
    : {
        rightIconAccessibilityLabel: t`Abandonner l'inscription`,
        rightIcon: Close,
        onRightIconPress: showQuitSignupModal,
      }
  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Ton e-mail`}
          leftIconAccessibilityLabel={t`Revenir en arrière`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          {...rightIconProps}
        />
        <SetEmailModalContent>
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
          <StyledCheckBox onPress={() => setIsNewsletterChecked(!isNewsletterChecked)}>
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
          <StepDots numberOfSteps={SIGNUP_NUMBER_OF_STEPS} currentStep={1} />
        </SetEmailModalContent>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="email-quit-signup"
        signupStep={SignupSteps.Email}
      />
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
