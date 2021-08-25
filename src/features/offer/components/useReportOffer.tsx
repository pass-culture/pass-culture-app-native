import { t } from '@lingui/macro'
import React from 'react'

import { ReportOfferDescription } from 'features/offer/components/ReportOfferDescription'
import { ReportOfferOtherReason } from 'features/offer/components/ReportOfferOtherReason'
import { ReportOfferReason } from 'features/offer/components/ReportOfferReason'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { IconInterface } from 'ui/svg/icons/types'

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

interface ReportOfferModalContent {
  children: JSX.Element
  title: string
  leftIcon: React.FC<IconInterface> | undefined
  onLeftIconPress: (() => void) | undefined
}

export const useReportOffer = (props: Props) => {
  const pickChildren = (step: ReportSteps) => {
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
          leftIcon: ArrowPrevious,
          onLeftIconPress: () => props.setReportStep(ReportSteps.REPORT_OFFER_DESCRIPTION),
          title: t`Pourquoi signales-tu` + '\n' + t`cette offre ?`,
        }
      case ReportSteps.REPORT_OFFER_OTHER_REASON:
        return {
          children: (
            <ReportOfferOtherReason dismissModal={props.dismissModal} offerId={props.offerId} />
          ),
          leftIcon: ArrowPrevious,
          onLeftIconPress: () => props.setReportStep(ReportSteps.REPORT_OFFER_REASON),
          title: t`Pourquoi signales-tu` + '\n' + t`cette offre ?`,
        }
      default:
        return {
          children: (
            <ReportOfferDescription
              onPressReportOffer={() => props.setReportStep(ReportSteps.REPORT_OFFER_REASON)}
            />
          ),
          leftIcon: undefined,
          onLeftIconPress: undefined,
          title: t`Signaler une offre`,
        }
    }
  }

  const childrenProps: ReportOfferModalContent = pickChildren(props.reportStep)

  return { childrenProps }
}
