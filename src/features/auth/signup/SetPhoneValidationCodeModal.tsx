import { t } from '@lingui/macro'
import React, { FC, useState } from 'react'
import styled from 'styled-components/native'

import { extractApiErrorMessage } from 'api/helpers'
import { useValidatePhoneNumberMutation } from 'features/auth/api'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { CodeInput, CodeValidation } from 'ui/components/inputs/CodeInput'
import { InputError } from 'ui/components/inputs/InputError'
import { AppModal } from 'ui/components/modals/AppModal'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { contactSupport } from '../support.services'

const CODE_INPUT_LENGTH = 6

export interface SetPhoneValidationCodeModalProps {
  visible: boolean
  dismissModal: () => void
  phoneNumber: string
  onGoBack: () => void
}

interface CodeInputState extends CodeValidation {
  code: string | null
}

export const SetPhoneValidationCodeModal: FC<SetPhoneValidationCodeModalProps> = (props) => {
  const [codeInputState, setCodeInputState] = useState<CodeInputState>({
    code: null,
    isComplete: false,
    isValid: false,
  })
  const [invalidCodeMessage, setInvalidCodeMessage] = useState('')

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(props.visible)

  const { mutate: validatePhoneNumber } = useValidatePhoneNumberMutation({ onSuccess, onError })

  function onSuccess() {
    props.dismissModal()
  }

  function onError(error: unknown) {
    setInvalidCodeMessage(extractApiErrorMessage(error))
  }

  function onChangeValue(value: string | null, validation: CodeValidation) {
    setCodeInputState({
      code: value,
      ...validation,
    })
  }

  function validateCode() {
    const { code } = codeInputState
    if (code) {
      validatePhoneNumber(code)
    }
  }

  return (
    <AppModal
      visible={props.visible}
      title={t`Confirme ton numéro`}
      rightIcon={Close}
      onRightIconPress={showFullPageModal}
      leftIcon={ArrowPrevious}
      onLeftIconPress={props.onGoBack}
      disableBackdropTap>
      <ModalContent>
        <Paragraphe>
          <Typo.Body>
            {t`Saisis le code envoyé par SMS au numéro` +
              ` ${formatPhoneNumber(props.phoneNumber)}.`}
          </Typo.Body>
        </Paragraphe>
        <Spacer.Column numberOfSpaces={6} />
        <CodeInput
          codeLength={CODE_INPUT_LENGTH}
          placeholder={'0'}
          enableValidation
          isValid={isCodeValid}
          isInputValid={isInputValid}
          onChangeValue={onChangeValue}
        />
        {invalidCodeMessage ? (
          <React.Fragment>
            <InputError visible messageId={invalidCodeMessage} numberOfSpacesTop={3} />
            <Spacer.Column numberOfSpaces={5} />
          </React.Fragment>
        ) : (
          <Spacer.Column numberOfSpaces={8} />
        )}
        <ButtonPrimary
          title={t`Continuer`}
          disabled={!codeInputState.isValid}
          testIdSuffix={t`continue`}
          onPress={validateCode}
        />
        <Spacer.Column numberOfSpaces={4} />
        <HelpRow>
          <Typo.Body>{t`Tu n'as pas reçu le sms ?`}</Typo.Body>
          <ButtonTertiary title={t`Réessayer`} inline />
        </HelpRow>
        <Spacer.Column numberOfSpaces={4} />
        <Separator color={ColorsEnum.GREY_MEDIUM} />
        <Spacer.Column numberOfSpaces={4} />
        <HelpRow>
          <Typo.Caption color={ColorsEnum.GREY_DARK}>
            {t`Si tu n’arrives pas à récuperer ton code tu peux`}
            <Spacer.Row numberOfSpaces={1} />
            <ButtonQuaternary
              title={t`Contacter le support`}
              icon={Email}
              onPress={contactSupport.forPhoneNumberConfirmation}
              inline
            />
          </Typo.Caption>
        </HelpRow>
      </ModalContent>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        signupStep={SignupSteps.PhoneNumber}
      />
    </AppModal>
  )
}

/** returns a 10-digit phone number with an unbreakable space every 2 digits
 *  example: formatPhoneNumber('0612345678) => '06 12 34 56 78'
 */
const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.split(/(\d{2})/).join('\u00a0')
}

const isCodeValid = (code: string | null, _isComplete: boolean) => {
  return code !== null && !isNaN(Number(code)) && code.length === CODE_INPUT_LENGTH
}

const isInputValid = (inputValue: string, _position: number) => {
  return !isNaN(Number(inputValue)) && inputValue.length === 1
}

const ModalContent = styled.View({
  width: '100%',
  alignItems: 'center',
})

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})

const HelpRow = styled.View({
  flexDirection: 'row',
  width: '100%',
  flexWrap: 'wrap',
  alignItems: 'center',
})
