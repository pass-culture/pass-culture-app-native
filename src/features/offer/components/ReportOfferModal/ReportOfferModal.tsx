import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { useReportOfferModalContent } from 'features/offer/components/useReportOfferModalContent/useReportOfferModalContent'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalLeftIconProps } from 'ui/components/modals/types'
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
  const { childrenProps } = useReportOfferModalContent({
    reportStep,
    setReportStep,
    dismissModal: props.dismissModal,
    offerId: props.offerId,
  })
  const modalLeftIconProps = {
    leftIconAccessibilityLabel: childrenProps.leftIconAccessibilityLabel,
    leftIcon: childrenProps.leftIcon,
    onLeftIconPress: childrenProps.onLeftIconPress,
  } as ModalLeftIconProps

  return (
    <AppModal
      visible={props.isVisible}
      title={childrenProps.title}
      onBackdropPress={props.dismissModal}
      {...modalLeftIconProps}
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={() => {
        props.dismissModal()
        setReportStep(ReportSteps.REPORT_OFFER_DESCRIPTION)
      }}>
      <ModalContent>{childrenProps.children}</ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View({
  width: '100%',
})
