import { t } from '@lingui/macro'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { useGoBack } from 'features/navigation/useGoBack'
import { BottomCardContentContainer, BottomContentPage } from 'ui/components/BottomContentPage'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

export const SetName: FunctionComponent = () => {
  const [name, setName] = useState('')
  const { goBack } = useGoBack('SetEmail', undefined)

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

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Ton e-mail`}
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
            value={name}
            autoFocus={true}
            onChangeText={setName}
            placeholder={t`Ton prénom`}
            onSubmitEditing={() => {
              'submit'
            }}
            ref={nameInput}
          />
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
