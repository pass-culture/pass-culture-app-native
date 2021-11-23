import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { SIGNUP_NUMBER_OF_STEPS } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { StyledStepDots } from 'features/auth/components/signupComponents'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'tests/utils'
import { BottomCardContentContainer, BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { isNameValid } from 'ui/components/inputs/nameCheck'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'SetName'>

export const SetName: FunctionComponent<Props> = ({ route }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('SetEmail', undefined)

  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked

  const nameInput = useRef<RNTextInput | null>(null)

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function showQuitSignupModal() {
    nameInput.current && nameInput.current.blur()
    showFullPageModal()
  }

  const isValidFirstName = isNameValid(firstName)
  const isValidLastName = isNameValid(lastName)
  const disabled = !isValidFirstName || !isValidLastName

  function submitName() {
    if (!disabled) {
      navigate('SetPassword', { email, isNewsletterChecked, firstName, lastName })
    }
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Comment t'appelles-tu ?`}
          leftIconAccessibilityLabel={t`Revenir en arrière`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIconAccessibilityLabel={t`Abandonner l'inscription`}
          rightIcon={Close}
          onRightIconPress={showQuitSignupModal}
        />
        <BottomCardContentContainer>
          <Spacer.Column numberOfSpaces={6} />
          <TextInput
            label={t`Prénom`}
            value={firstName}
            autoFocus={true}
            onChangeText={setFirstName}
            placeholder={t`Ton prénom`}
            ref={nameInput}
            {...accessibilityAndTestId(t`Entrée pour le prénom`)}
          />
          <InputError
            visible={!isValidFirstName && firstName.length > 0}
            messageId={t`Ton prénom ne doit pas contenir de chiffres ou de caractères spéciaux.`}
            numberOfSpacesTop={2}
          />
          <Spacer.Column numberOfSpaces={6} />
          <TextInput
            label={t`Nom`}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t`Ton nom`}
            ref={nameInput}
            {...accessibilityAndTestId(t`Entrée pour le nom`)}
          />
          <InputError
            visible={!isValidLastName && lastName.length > 0}
            messageId={t`Ton nom ne doit pas contenir de chiffres ou de caractères spéciaux.`}
            numberOfSpacesTop={2}
          />
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary title={t`Continuer`} onPress={submitName} disabled={disabled} />
          <Spacer.Column numberOfSpaces={5} />
          <StyledStepDots>
            {/* TODO(antoinewg): wrong step number. Wrong screen also: we will move SetName to the profile steps */}
            <StepDots numberOfSteps={SIGNUP_NUMBER_OF_STEPS} currentStep={2} />
          </StyledStepDots>
        </BottomCardContentContainer>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="password-quit-signup"
        signupStep={SignupSteps.Name}
      />
    </React.Fragment>
  )
}
