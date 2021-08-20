import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ReportOfferReason } from 'features/offer/components/ReportOfferReason'
import { AppModal } from 'ui/components/modals/AppModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'

interface Props {
  isVisible: boolean
  dismissModal: () => void
  onGoBack: () => void
  onPressOtherReason: () => void
  offerId: number
}

export const ReportOfferReasonModal: FunctionComponent<Props> = (props) => {
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
        <ReportOfferReason {...props} />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
})
