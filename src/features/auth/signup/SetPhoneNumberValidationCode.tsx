import { t } from '@lingui/macro'
import React, { FC, useState } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { CodeInput } from 'ui/components/inputs/CodeInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { Separator } from 'ui/components/Separator'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { contactSupport } from '../support.services'

const CODE_INPUT_LENGTH = 6

interface Props {
  visible: boolean
  dismissModal: () => void
  // TODO(PC-8137) create phone number property retrieved from SetPhoneNumberModal
}

export const SetPhoneNumberValidationCode: FC<Props> = (props) => {
  const [_code, setCode] = useState<string | null>('')

  return (
    <AppModal
      visible={props.visible}
      title={t`Confirme ton numéro`}
      rightIcon={Close}
      // TODO(PC-8132) display QuitSignupModal on right icon press
      onRightIconPress={props.dismissModal}
      leftIcon={ArrowPrevious}
      disableBackdropTap={true}
      isScrollable>
      <ModalContent>
        <Paragraphe>
          {/* TODO(PC-8137) display phone number property */}
          <Typo.Body>{t`Saisis le code envoyé par SMS au numéro +33\u00a01\u00a023\u00a045\u00a067\u00a089.`}</Typo.Body>
        </Paragraphe>
        <Spacer.Column numberOfSpaces={6} />
        <CodeInput
          codeLength={CODE_INPUT_LENGTH}
          placeholder={'0'}
          enableValidation
          isValid={isCodeValid}
          isInputValid={isInputValid}
          onChangeValue={(code, _validation) => setCode(code)}
        />
        <Spacer.Column numberOfSpaces={8} />
        <ButtonPrimary title={t`Continuer`} />
        <Spacer.Column numberOfSpaces={4} />
        <HelpRow>
          <Typo.Body>{t`Tu n'as pas reçu le sms ?`}</Typo.Body>
          <ButtonTertiary title={t`Réessayer`} inline />
        </HelpRow>
        <Spacer.Column numberOfSpaces={4} />
        <Separator color={ColorsEnum.GREY_MEDIUM} />
        <Spacer.Column numberOfSpaces={4} />
        <HelpRow>
          <Typo.Caption
            color={
              ColorsEnum.GREY_DARK
            }>{t`Si tu n’arrives pas à récuperer ton code tu peux`}</Typo.Caption>
          <Spacer.Row numberOfSpaces={1} />
          <ButtonQuaternary
            title={t`Contacter le support`}
            icon={Email}
            // TODO(PC-8138) contactSupport.forPhoneNumberConfirmation
            onPress={contactSupport.forGenericQuestion}
            inline
          />
        </HelpRow>
      </ModalContent>
    </AppModal>
  )
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
