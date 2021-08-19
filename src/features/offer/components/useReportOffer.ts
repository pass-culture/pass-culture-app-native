import { useState } from 'react'

export enum ReportSteps {
  NOT_VISIBLE = -1,
  REPORT_OFFER_DESCRIPTION = 0,
  REPORT_OFFER_REASON = 1,
  REPORT_OFFER_OTHER_REASON = 2,
}

export const useReportOffer = () => {
  const [reportStep, setReportStep] = useState(ReportSteps.NOT_VISIBLE)

  return { reportStep, setReportStep }
}
