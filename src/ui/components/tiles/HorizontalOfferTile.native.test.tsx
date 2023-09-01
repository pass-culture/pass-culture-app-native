import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as logClickOnProductAPI from 'libs/algolia/analytics/logClickOnOffer'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { fireEvent, render, screen } from 'tests/utils'

import { HorizontalOfferTile } from './HorizontalOfferTile'

const mockOffer = mockedAlgoliaResponse.hits[0]
const offerId = Number(mockOffer.objectID)
const mockAnalyticsParams: OfferAnalyticsParams = {
  from: 'search',
  query: '',
  index: 0,
  searchId: '539b285e',
}

let mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))
jest.mock('react-query')

const spyLogClickOnOffer = jest.fn()
const mockUseLogClickOnOffer = jest.spyOn(logClickOnProductAPI, 'useLogClickOnOffer')
mockUseLogClickOnOffer.mockReturnValue({ logClickOnOffer: spyLogClickOnOffer })

jest.mock('libs/algolia/analytics/SearchAnalyticsWrapper', () => ({
  useSearchAnalyticsState: () => ({ currentQueryID: 'abc123' }),
}))

describe('HorizontalOfferTile component', () => {
  it('should navigate to the offer when pressing an offer', async () => {
    render(<HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />)
    await fireEvent.press(screen.getByRole('link'))
    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'search',
      searchId: '539b285e',
    })
  })

  it('should log analytics event when pressing an offer', async () => {
    render(<HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />)
    await fireEvent.press(screen.getByRole('link'))
    expect(analytics.logConsultOffer).toBeCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'search',
      query: '',
      index: 0,
      searchId: '539b285e',
    })
  })

  it('should notify Algolia when pressing an offer', async () => {
    render(<HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />)

    const hitComponent = screen.getByRole('link')
    await fireEvent.press(hitComponent)

    expect(spyLogClickOnOffer).toHaveBeenCalledWith({
      objectID: '102280',
      position: 0,
    })
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    render(<HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />)
    expect(screen.queryByText('10 km')).toBeOnTheScreen()
  })

  describe('When pressing an offer without object id', () => {
    const offer = { ...mockOffer, objectID: '' }

    it('should not navigate to the offer', async () => {
      render(<HorizontalOfferTile offer={offer} analyticsParams={mockAnalyticsParams} />)
      await fireEvent.press(screen.getByRole('link'))
      expect(navigate).not.toHaveBeenCalled()
    })

    it('should not log analytics event', async () => {
      render(<HorizontalOfferTile offer={offer} analyticsParams={mockAnalyticsParams} />)
      await fireEvent.press(screen.getByRole('link'))
      expect(analytics.logConsultOffer).not.toHaveBeenCalled()
    })
  })
})
