import { ReportSteps } from 'features/offer/enums'
import { useReportOfferModalContent } from 'features/offer/helpers/useReportOfferModalContent/useReportOfferModalContent'

describe('useReportOfferModalContent hook description', () => {
  const setReportStep = jest.fn()
  const dismissModal = jest.fn()
  const offerId = 0

  it('should display the ReportOfferDescription and show no back button if step is 0', () => {
    const { childrenProps } = useReportOfferModalContent({
      reportStep: ReportSteps.REPORT_OFFER_DESCRIPTION,
      setReportStep,
      dismissModal,
      offerId,
    })
    expect(childrenProps.children).toMatchSnapshot()
    expect(childrenProps.leftIcon).toBeUndefined()
  })

  it('should display the ReportOfferReason and show a back button if step is 1', () => {
    const { childrenProps } = useReportOfferModalContent({
      reportStep: ReportSteps.REPORT_OFFER_REASON,
      setReportStep,
      dismissModal,
      offerId,
    })
    expect(childrenProps.leftIcon).not.toBeUndefined()
    expect(childrenProps.children).toMatchSnapshot()
  })

  it('should display the ReportOfferOtherReason and show a back button if step is 2', () => {
    const { childrenProps } = useReportOfferModalContent({
      reportStep: ReportSteps.REPORT_OFFER_OTHER_REASON,
      setReportStep,
      dismissModal,
      offerId,
    })
    expect(childrenProps.leftIcon).not.toBeUndefined()
    expect(childrenProps.children).toMatchSnapshot()
  })
})
