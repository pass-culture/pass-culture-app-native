import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { useReportOffer } from 'features/offer/components/useReportOffer'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'

enum ReportSteps {
  REPORT_OFFER_DESCRIPTION = 0,
  REPORT_OFFER_REASON = 1,
  REPORT_OFFER_OTHER_REASON = 2,
}

interface Props {
  isVisible: boolean
  dismissModal: () => void
  offerId: number
}

export const ReportOfferModal: FunctionComponent<Props> = (props) => {
  const [reportStep, setReportStep] = useState(ReportSteps.REPORT_OFFER_DESCRIPTION)
  const { childrenProps } = useReportOffer({
    reportStep,
    setReportStep,
    dismissModal: props.dismissModal,
    offerId: props.offerId,
  })

  return (
    <AppModal
      visible={props.isVisible}
      title={childrenProps.title}
      rightIcon={Close}
      leftIcon={childrenProps.leftIcon}
      onRightIconPress={() => {
        props.dismissModal()
        setReportStep(ReportSteps.REPORT_OFFER_DESCRIPTION)
      }}
      onBackdropPress={props.dismissModal}
      onLeftIconPress={childrenProps.onLeftIconPress}>
      <ModalContent>{childrenProps.children}</ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
})
