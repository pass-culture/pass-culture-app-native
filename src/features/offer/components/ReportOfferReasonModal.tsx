import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { useState } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { RadioButton } from 'ui/components/RadioButton'
import { SectionRow } from 'ui/components/SectionRow'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Spacer } from 'ui/theme'

interface Props {
  isVisible: boolean
  dismissModal: () => void
  onGoBack: () => void
  onPressOtherReason: () => void
}

const REASONS_FOR_REPORTING = [
  {
    id: 'DESCRIPTION',
    title: t`La description est non conforme`,
    subtitle: t`(La date ne correspond pas, mauvaise description…)`,
  },
  { id: 'PRICE', title: t`Le tarif est trop élevé`, subtitle: t`(comparé à l’offre public)` },
  {
    id: 'CONTENT',
    title: t`Le contenu est inapproprié`,
    subtitle: t`(violence, incitation à la haine, nudité...)`,
  },
]

export const ReportOfferReasonModal: FunctionComponent<Props> = (props) => {
  const [_selectedReason, setSelectedReason] = useState('')

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
        <Spacer.Column numberOfSpaces={3} />
        <RadioButton choices={REASONS_FOR_REPORTING} onSelect={setSelectedReason} />
        <SectionRow title={t`Autre`} type={'navigable'} onPress={props.onPressOtherReason} />
        <Spacer.Column numberOfSpaces={10.5} />
        <ButtonPrimary title={t`Signaler l'offre`} />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
})
