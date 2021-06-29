import React from 'react'

import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { OfferSeeMore } from '../OfferSeeMore'

const offerId = 116656

describe('OfferSeeMore', () => {
  it('displays the short wording when no props are precised', () => {
    const { queryByText } = render(<OfferSeeMore id={123} />)
    expect(queryByText("Voir plus d'informations")).toBeFalsy()
    expect(queryByText('voir plus')).toBeTruthy()
  })
  it('displays the long wording when precised', () => {
    const { queryByText } = render(<OfferSeeMore id={123} longWording />)
    expect(queryByText('voir plus')).toBeFalsy()
    expect(queryByText("Voir plus d'informations")).toBeTruthy()
  })
  describe('Analytics', () => {
    it('should log ConsultDescriptionDetails each time we open the details', async () => {
      const { getByTestId } = render(<OfferSeeMore id={offerId} longWording />)

      fireEvent.press(getByTestId('description-details-button'))
      expect(analytics.logConsultDescriptionDetails).toHaveBeenCalledTimes(1)
      expect(analytics.logConsultDescriptionDetails).toHaveBeenCalledWith(offerId)

      fireEvent.press(getByTestId('description-details-button'))
      expect(analytics.logConsultDescriptionDetails).toHaveBeenCalledTimes(2)
    })
  })
})
