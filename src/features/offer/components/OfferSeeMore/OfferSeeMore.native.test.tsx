import React from 'react'

import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { OfferSeeMore } from './OfferSeeMore'

const offerId = 116656

describe('OfferSeeMore', () => {
  it('displays the short wording when no props are precised', () => {
    render(<OfferSeeMore id={123} />)
    expect(screen.queryByText('Voir plus d’informations')).not.toBeOnTheScreen()
    expect(screen.queryByText('voir plus')).toBeOnTheScreen()
  })
  it('displays the long wording when precised', () => {
    render(<OfferSeeMore id={123} longWording />)
    expect(screen.queryByText('voir plus')).not.toBeOnTheScreen()
    expect(screen.queryByText('Voir plus d’informations')).toBeOnTheScreen()
  })
  describe('Analytics', () => {
    it('should log ConsultDescriptionDetails each time we open the details', async () => {
      render(<OfferSeeMore id={offerId} longWording />)

      fireEvent.press(screen.getByTestId('Voir plus d’informations'))
      expect(analytics.logConsultDescriptionDetails).toHaveBeenCalledTimes(1)
      expect(analytics.logConsultDescriptionDetails).toHaveBeenCalledWith(offerId)

      fireEvent.press(screen.getByTestId('Voir plus d’informations'))
      expect(analytics.logConsultDescriptionDetails).toHaveBeenCalledTimes(2)
    })
  })
})
