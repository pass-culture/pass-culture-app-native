import React from 'react'

import { ReportOfferDescription } from 'features/offer/components/ReportOfferDescription'
import { ReportOfferOtherReason } from 'features/offer/components/ReportOfferOtherReason/ReportOfferOtherReason'
import { ReportOfferReason } from 'features/offer/components/ReportOfferReason/ReportOfferReason'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { LINE_BREAK } from 'ui/theme/constants'

export enum ReportSteps {
  REPORT_OFFER_DESCRIPTION = 0,
  REPORT_OFFER_REASON = 1,
  REPORT_OFFER_OTHER_REASON = 2,
}

interface Props {
  offerId: number
  reportStep: number
  setReportStep: (number: ReportSteps) => void
  dismissModal: () => void
}

type ReportOfferModalContent = {
  children: JSX.Element
  title: string
} & ModalLeftIconProps

export const useReportOfferModalContent = (props: Props) => {
  const pickChildren = (step: ReportSteps): ReportOfferModalContent => {
    switch (step) {
      case ReportSteps.REPORT_OFFER_REASON:
        return {
          children: (
            <ReportOfferReason
              onPressOtherReason={() => props.setReportStep(ReportSteps.REPORT_OFFER_OTHER_REASON)}
              dismissModal={props.dismissModal}
              offerId={props.offerId}
            />
          ),
          leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
          leftIcon: ArrowPrevious,
          onLeftIconPress: () => props.setReportStep(ReportSteps.REPORT_OFFER_DESCRIPTION),
          title: 'Pourquoi signales-tu' + LINE_BREAK + 'cette offre\u00a0?',
        }
      case ReportSteps.REPORT_OFFER_OTHER_REASON:
        return {
          children: (
            <ReportOfferOtherReason dismissModal={props.dismissModal} offerId={props.offerId} />
          ),
          leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
          leftIcon: ArrowPrevious,
          onLeftIconPress: () => props.setReportStep(ReportSteps.REPORT_OFFER_REASON),
          title: 'Pourquoi signales-tu' + LINE_BREAK + 'cette offre\u00a0?',
        }
      default:
        return {
          children: (
            <ReportOfferDescription
              onPressReportOffer={() => props.setReportStep(ReportSteps.REPORT_OFFER_REASON)}
            />
          ),
          leftIconAccessibilityLabel: undefined,
          leftIcon: undefined,
          onLeftIconPress: undefined,
          title: 'Signaler une offre',
        }
    }
  }

  return { childrenProps: pickChildren(props.reportStep) }
}
