import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { QuitSignupModal, SignupSteps } from 'features/auth/signup/QuitSignupModal'
import { useBackNavigation } from 'features/navigation/backNavigation'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { CheckboxInput } from 'ui/components/inputs/CheckboxInput'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, padding, Spacer, Typo } from 'ui/theme'

export const SetEmail: FunctionComponent = () => {
  const [email, setEmail] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false)

  const { params } = useRoute<UseRouteType<'SetEmail'>>()
  const navigation = useNavigation<UseNavigationType>()

  const shouldDisableValidateButton = isValueEmpty(email)

  const emailInput = useRef<RNTextInput | null>(null)

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  const complexGoBack = useBackNavigation<'SetEmail'>()

  function onChangeEmail(email: string) {
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

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={t`Ton e-mail`}
          leftIcon={ArrowPrevious}
          onLeftIconPress={complexGoBack}
          rightIcon={params?.preventCancellation ? undefined : Close}
          onRightIconPress={showQuitSignupModal}
        />
        <ModalContent>
          <StyledInput>
            <Typo.Body>{t`Adresse e-mail`}</Typo.Body>
            <Spacer.Column numberOfSpaces={2} />
            <TextInput
              autoCapitalize="none"
              autoFocus={true}
              keyboardType="email-address"
              onChangeText={onChangeEmail}
              placeholder={t`tonadresse@email.com`}
              ref={emailInput}
              textContentType="emailAddress"
              value={email}
            />
            <InputError
              visible={hasError}
              messageId="Format de l'e-mail incorrect"
              numberOfSpacesTop={1}
            />
          </StyledInput>
          <Spacer.Column numberOfSpaces={4} />
          <StyledCheckBox>
            <CheckboxInput isChecked={isNewsletterChecked} setIsChecked={setIsNewsletterChecked} />
            <CheckBoxText>
              {t`Reçois nos recommandations culturelles à proximité de chez toi par e-mail.`}
            </CheckBoxText>
          </StyledCheckBox>
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            title={t`Continuer`}
            onPress={validateEmail}
            isLoading={false}
            disabled={shouldDisableValidateButton}
          />
          <Spacer.Column numberOfSpaces={5} />
          <StepDots numberOfSteps={5} currentStep={1} />
        </ModalContent>
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

const ModalContent = styled.View({
  paddingTop: getSpacing(7),
  alignItems: 'center',
  width: '100%',
  maxWidth: getSpacing(125),
})

const CheckBoxText = styled(Typo.Body)({
  alignSelf: 'center',
  ...padding(0, 8, 0, 4),
})

const StyledCheckBox = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
})

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
})
