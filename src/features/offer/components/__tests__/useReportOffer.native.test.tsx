import { ReportSteps, useReportOffer } from 'features/offer/components/useReportOffer'

describe('useReportOffer hook description', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setReportStep = jest.fn()
  const dismissModal = jest.fn()
  const offerId = 0

  it('should display the ReportOfferDescription and show no back button if step is 0', () => {
    const { childrenProps } = useReportOffer({
      reportStep: ReportSteps.REPORT_OFFER_DESCRIPTION,
      setReportStep,
      dismissModal,
      offerId,
    })
    expect(childrenProps.children).toMatchSnapshot()
    expect(childrenProps.leftIcon).toBe(undefined)
  })
  it('should display the ReportOfferReason and show a back button if step is 1', () => {
    const { childrenProps } = useReportOffer({
      reportStep: ReportSteps.REPORT_OFFER_REASON,
      setReportStep,
      dismissModal,
      offerId,
    })
    expect(childrenProps.leftIcon).not.toBe(undefined)
    expect(childrenProps.children).toMatchSnapshot()
  })
  it('should display the ReportOfferOtherReason and show a back button if step is 2', () => {
    const { childrenProps } = useReportOffer({
      reportStep: ReportSteps.REPORT_OFFER_OTHER_REASON,
      setReportStep,
      dismissModal,
      offerId,
    })
    expect(childrenProps.leftIcon).not.toBe(undefined)
    expect(childrenProps.children).toMatchSnapshot()
  })
})
