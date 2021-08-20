import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ReportOfferOtherReason } from 'features/offer/components/ReportOfferOtherReason'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'

interface Props {
  isVisible: boolean
  dismissModal: () => void
  onGoBack: () => void
  offerId: number
}

export const ReportOfferOtherReasonModal: FunctionComponent<Props> = (props) => {
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
        <ReportOfferOtherReason dismissModal={props.dismissModal} offerId={props.offerId} />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
})
