import { useState } from 'react'

export const useReportOffer = () => {
  const [reportStep, setReportStep] = useState<number | null>(null)

  return { reportStep, setReportStep }
}
