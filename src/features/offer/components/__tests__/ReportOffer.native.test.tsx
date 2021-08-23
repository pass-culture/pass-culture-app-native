import React from 'react'

import { ReportOfferModalWrapper } from 'features/offer/components/ReportOfferModalWrapper'
import { fireEvent, render } from 'tests/utils'

jest.mock('react-query')
jest.mock('features/offer/services/useReportOffer')

describe('ReportOffer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('General modal behavior', () => {
    const isReportDescriptionVisible = false
    const isReportReasonVisible = false
    const isReportOtherReasonVisible = false

    const offerId = 0

    const hideReportModal = jest.fn()
    const navigateToReportReason = jest.fn()
    const goBackToReportDescription = jest.fn()
    const navigateToReportOtherReason = jest.fn()
    const goBackToReportReason = jest.fn()

    it("should switch to report offer reasons upon clicking on 'signaler l'offre' from 1st modal", async () => {
      const ReportOfferComponent = render(
        <ReportOfferModalWrapper
          isReportDescriptionVisible={isReportDescriptionVisible}
          isReportReasonVisible
          isReportOtherReasonVisible={isReportOtherReasonVisible}
          offerId={offerId}
          hideReportModal={hideReportModal}
          navigateToReportReason={navigateToReportReason}
          goBackToReportDescription={goBackToReportDescription}
          navigateToReportOtherReason={navigateToReportOtherReason}
          goBackToReportReason={goBackToReportReason}
        />
      )
      const goToReasonButton = await ReportOfferComponent.findByTestId('go-to-reason-report-button')
      fireEvent.press(goToReasonButton)
      expect(navigateToReportReason).toHaveBeenCalledWith()
    })
    it("should go back to report offer description upon clicking on the left arrow from 'report reason'", async () => {
      const ReportOfferComponent = render(
        <ReportOfferModalWrapper
          isReportDescriptionVisible={isReportDescriptionVisible}
          isReportReasonVisible
          isReportOtherReasonVisible={isReportOtherReasonVisible}
          offerId={offerId}
          hideReportModal={hideReportModal}
          navigateToReportReason={navigateToReportReason}
          goBackToReportDescription={goBackToReportDescription}
          navigateToReportOtherReason={navigateToReportOtherReason}
          goBackToReportReason={goBackToReportReason}
        />
      )
      const leftIconButtons = await ReportOfferComponent.findAllByTestId('leftIcon')
      // pressing the back icon from the second modal
      fireEvent.press(leftIconButtons[0])
      expect(goBackToReportDescription).toHaveBeenCalledWith()
    })
    it("should go back to report offer reason upon clicking on the left arrow from 'Other reason'", async () => {
      const ReportOfferComponent = render(
        <ReportOfferModalWrapper
          isReportDescriptionVisible={isReportDescriptionVisible}
          isReportReasonVisible={isReportReasonVisible}
          isReportOtherReasonVisible
          offerId={offerId}
          hideReportModal={hideReportModal}
          navigateToReportReason={navigateToReportReason}
          goBackToReportDescription={goBackToReportDescription}
          navigateToReportOtherReason={navigateToReportOtherReason}
          goBackToReportReason={goBackToReportReason}
        />
      )
      const leftIconButtons = await ReportOfferComponent.findAllByTestId('leftIcon')
      // pressing the back icon from the third modal
      fireEvent.press(leftIconButtons[1])
      expect(goBackToReportReason).toHaveBeenCalledWith()
    })
    it('should close the 1st report offer modal upon clicking on the cross', async () => {
      const ReportOfferComponent = render(
        <ReportOfferModalWrapper
          isReportDescriptionVisible
          isReportReasonVisible={isReportReasonVisible}
          isReportOtherReasonVisible={isReportOtherReasonVisible}
          offerId={offerId}
          hideReportModal={hideReportModal}
          navigateToReportReason={navigateToReportReason}
          goBackToReportDescription={goBackToReportDescription}
          navigateToReportOtherReason={navigateToReportOtherReason}
          goBackToReportReason={goBackToReportReason}
        />
      )
      const closeModalButtons = await ReportOfferComponent.findAllByTestId('rightIcon')
      // pressing the close icon from the first modal
      fireEvent.press(closeModalButtons[0])
      expect(hideReportModal).toHaveBeenCalledWith()
    })
    it('should close the 2nd report offer modal upon clicking on the cross', async () => {
      const ReportOfferComponent = render(
        <ReportOfferModalWrapper
          isReportDescriptionVisible={isReportDescriptionVisible}
          isReportReasonVisible
          isReportOtherReasonVisible={isReportOtherReasonVisible}
          offerId={offerId}
          hideReportModal={hideReportModal}
          navigateToReportReason={navigateToReportReason}
          goBackToReportDescription={goBackToReportDescription}
          navigateToReportOtherReason={navigateToReportOtherReason}
          goBackToReportReason={goBackToReportReason}
        />
      )
      const closeModalButtons = await ReportOfferComponent.findAllByTestId('rightIcon')
      // pressing the close icon from the second modal
      fireEvent.press(closeModalButtons[1])
      expect(hideReportModal).toHaveBeenCalledWith()
    })
    it('should close the 3rd report offer modal upon clicking on the cross', async () => {
      const ReportOfferComponent = render(
        <ReportOfferModalWrapper
          isReportDescriptionVisible={isReportDescriptionVisible}
          isReportReasonVisible={isReportReasonVisible}
          isReportOtherReasonVisible
          offerId={offerId}
          hideReportModal={hideReportModal}
          navigateToReportReason={navigateToReportReason}
          goBackToReportDescription={goBackToReportDescription}
          navigateToReportOtherReason={navigateToReportOtherReason}
          goBackToReportReason={goBackToReportReason}
        />
      )
      const closeModalButtons = await ReportOfferComponent.findAllByTestId('rightIcon')
      // pressing the close icon from the third modal
      fireEvent.press(closeModalButtons[2])
      expect(hideReportModal).toHaveBeenCalledWith()
    })

    it("should close the 2nd modal upon clicking on 'signaler l'offre'", async () => {
      const ReportOfferComponent = render(
        <ReportOfferModalWrapper
          isReportDescriptionVisible={isReportDescriptionVisible}
          isReportReasonVisible
          isReportOtherReasonVisible={isReportOtherReasonVisible}
          offerId={offerId}
          hideReportModal={hideReportModal}
          navigateToReportReason={navigateToReportReason}
          goBackToReportDescription={goBackToReportDescription}
          navigateToReportOtherReason={navigateToReportOtherReason}
          goBackToReportReason={goBackToReportReason}
        />
      )

      const reportOfferButton = await ReportOfferComponent.findByTestId('report-button')
      fireEvent.press(reportOfferButton)
      expect(hideReportModal).toHaveBeenCalledWith()
    })
    it("should close the 3rd modal upon clicking on 'signaler l'offre'", async () => {
      const ReportOfferComponent = render(
        <ReportOfferModalWrapper
          isReportDescriptionVisible={isReportDescriptionVisible}
          isReportReasonVisible
          isReportOtherReasonVisible={isReportOtherReasonVisible}
          offerId={offerId}
          hideReportModal={hideReportModal}
          navigateToReportReason={navigateToReportReason}
          goBackToReportDescription={goBackToReportDescription}
          navigateToReportOtherReason={navigateToReportOtherReason}
          goBackToReportReason={goBackToReportReason}
        />
      )

      const reportOfferButton = await ReportOfferComponent.findByTestId('report-other-button')
      fireEvent.press(reportOfferButton)
      expect(hideReportModal).toHaveBeenCalledWith()
    })
    describe('Report offer snapshots', () => {
      it('should match report offer description snapshot', () => {
        const ReportOfferFirstModalComponent = render(
          <ReportOfferModalWrapper
            isReportDescriptionVisible
            isReportReasonVisible={isReportReasonVisible}
            isReportOtherReasonVisible={isReportOtherReasonVisible}
            offerId={offerId}
            hideReportModal={hideReportModal}
            navigateToReportReason={navigateToReportReason}
            goBackToReportDescription={goBackToReportDescription}
            navigateToReportOtherReason={navigateToReportOtherReason}
            goBackToReportReason={goBackToReportReason}
          />
        )
        expect(ReportOfferFirstModalComponent).toMatchSnapshot()
      })
      it('should match report offer other reason snapshot', () => {
        const ReportOfferThirdModalComponent = render(
          <ReportOfferModalWrapper
            isReportDescriptionVisible={isReportDescriptionVisible}
            isReportReasonVisible={isReportReasonVisible}
            isReportOtherReasonVisible
            offerId={offerId}
            hideReportModal={hideReportModal}
            navigateToReportReason={navigateToReportReason}
            goBackToReportDescription={goBackToReportDescription}
            navigateToReportOtherReason={navigateToReportOtherReason}
            goBackToReportReason={goBackToReportReason}
          />
        )
        expect(ReportOfferThirdModalComponent).toMatchSnapshot()
      })
      it('should match report offer reason snapshot', () => {
        const ReportOfferSecondModalComponent = render(
          <ReportOfferModalWrapper
            isReportDescriptionVisible={isReportDescriptionVisible}
            isReportReasonVisible
            isReportOtherReasonVisible={isReportOtherReasonVisible}
            offerId={offerId}
            hideReportModal={hideReportModal}
            navigateToReportReason={navigateToReportReason}
            goBackToReportDescription={goBackToReportDescription}
            navigateToReportOtherReason={navigateToReportOtherReason}
            goBackToReportReason={goBackToReportReason}
          />
        )
        expect(ReportOfferSecondModalComponent).toMatchSnapshot()
      })
    })
  })
})
