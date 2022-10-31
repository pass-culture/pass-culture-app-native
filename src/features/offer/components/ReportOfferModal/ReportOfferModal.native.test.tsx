import React from 'react'

import { ReportOfferModal } from 'features/offer/components/ReportOfferModal/ReportOfferModal'
import { fireEvent, render } from 'tests/utils'

jest.mock('react-query')
jest.mock('features/offer/services/useReportOffer')
jest.mock('features/offer/components/useReportOfferModalContent/useReportOfferModalContent')

describe('ReportOffer', () => {
  describe('General modal behavior', () => {
    const isReportOfferModalVisible = false

    const offerId = 0

    const hideReportModal = jest.fn()

    it('should call dismiss modal upon rightIconPress', async () => {
      const ReportOfferModalComponent = render(
        <ReportOfferModal isVisible offerId={offerId} dismissModal={hideReportModal} />
      )

      const closeButton = await ReportOfferModalComponent.findByTestId('Fermer la modale')
      fireEvent.press(closeButton)
      expect(hideReportModal).toHaveBeenCalledWith()
    })
    describe('Report offer snapshots', () => {
      it('should display report offer modal if isVisible is true', () => {
        const ReportOfferModalDescription = render(
          <ReportOfferModal isVisible offerId={offerId} dismissModal={hideReportModal} />
        )
        expect(ReportOfferModalDescription).toMatchSnapshot()
      })
      it('should not display report offer modal if isVisible is false', () => {
        const ReportOfferModalDescription = render(
          <ReportOfferModal
            isVisible={isReportOfferModalVisible}
            offerId={offerId}
            dismissModal={hideReportModal}
          />
        )
        expect(ReportOfferModalDescription).toMatchSnapshot()
      })
    })
  })
})
