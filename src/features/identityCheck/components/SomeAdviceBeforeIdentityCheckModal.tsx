import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Typo } from 'ui/theme'

export interface Props {
  visible: boolean
  hideModal: () => void
}

export const SomeAdviceBeforeIdentityCheckModal: FunctionComponent<Props> = (props) => {
  return (
    <AppModal
      visible={props.visible}
      title={t`Quelques conseils`}
      leftIconAccessibilityLabel={t`Revenir en arrière`}
      leftIcon={ArrowPrevious}
      onLeftIconPress={props.hideModal}
      rightIconAccessibilityLabel={undefined}
      rightIcon={undefined}
      onRightIconPress={undefined}>
      <Description>
        <Typo.Body>
          {t`Il est important que les informations de ton document soient parfaitement lisibles.`}
          {'\n'}
          {t`Nos conseils :`}
        </Typo.Body>
      </Description>
      <ButtonPrimary title={t`J'ai compris`} onPress={props.hideModal} />
    </AppModal>
  )
}

const Description = styled.Text({
  textAlign: 'center',
})
