import { t } from '@lingui/macro'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { LargeTextInput } from 'ui/components/inputs/LargeTextInput'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

interface Props {
  isVisible: boolean
  dismissModal: () => void
  onGoBack: () => void
}

export const ReportOfferOtherReasonModal: FunctionComponent<Props> = (props) => {
  const [inputText, setInputText] = useState('')

  return (
    <AppModal
      visible={props.isVisible}
      title={t`Pourquoi signales-tu` + '\n' + t`cette offre ?`}
      rightIcon={Close}
      onRightIconPress={props.dismissModal}
      leftIcon={ArrowPrevious}
      onLeftIconPress={props.onGoBack}
      onBackdropPress={props.dismissModal}>
      <ModalContent>
        <Intro>{t`Décris en quelques mots la raison pour laquelle tu souhaites signaler cette offre.`}</Intro>
        <Spacer.Column numberOfSpaces={4} />
        <InputTitle>{t`Autre raison`}</InputTitle>
        <Spacer.Column numberOfSpaces={2} />
        <LargeTextInput value={inputText} onChangeText={setInputText} maxLength={200} />
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary title={t`Signaler l'offre`} disabled={!inputText} />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
})

const Intro = styled(Typo.Caption)({
  textAlign: 'left',
  color: ColorsEnum.GREY_DARK,
})

const InputTitle = styled(Typo.ButtonText)({
  textAlign: 'left',
})
