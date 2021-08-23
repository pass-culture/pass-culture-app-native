import React from 'react'

import { ReportOfferDescriptionModal } from 'features/offer/components/ReportOfferDescriptionModal'
import { ReportOfferOtherReasonModal } from 'features/offer/components/ReportOfferOtherReasonModal'
import { ReportOfferReasonModal } from 'features/offer/components/ReportOfferReasonModal'

interface Props {
  isReportDescriptionVisible: boolean
  hideReportModal: () => void
  navigateToReportReason: () => void
  isReportReasonVisible: boolean
  goBackToReportDescription: () => void
  navigateToReportOtherReason: () => void
  offerId: number
  isReportOtherReasonVisible: boolean
  goBackToReportReason: () => void
}

export const ReportOfferModalWrapper = (props: Props) => {
  return (
    <React.Fragment>
      <ReportOfferDescriptionModal
        isVisible={props.isReportDescriptionVisible}
        dismissModal={props.hideReportModal}
        onPressReportOffer={props.navigateToReportReason}
      />
      <ReportOfferReasonModal
        isVisible={props.isReportReasonVisible}
        dismissModal={props.hideReportModal}
        onGoBack={props.goBackToReportDescription}
        onPressOtherReason={props.navigateToReportOtherReason}
        offerId={props.offerId}
      />
      <ReportOfferOtherReasonModal
        isVisible={props.isReportOtherReasonVisible}
        dismissModal={props.hideReportModal}
        onGoBack={props.goBackToReportReason}
        offerId={props.offerId}
      />
    </React.Fragment>
  )
}
