import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as logClickOnProductAPI from 'libs/algolia/analytics/logClickOnOffer'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { HorizontalOfferTile } from './HorizontalOfferTile'

const mockOffer = mockedAlgoliaResponse.hits[0]
// @ts-expect-error: because of noUncheckedIndexedAccess
const offerId = Number(mockOffer.objectID)
const mockAnalyticsParams: OfferAnalyticsParams = {
  from: 'search',
  query: '',
  index: 0,
  searchId: '539b285e',
}

let mockDistance: string | null = null
jest.mock('libs/location/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const spyLogClickOnOffer = jest.fn()
const mockUseLogClickOnOffer = jest.spyOn(logClickOnProductAPI, 'useLogClickOnOffer')
mockUseLogClickOnOffer.mockReturnValue({ logClickOnOffer: spyLogClickOnOffer })

jest.mock('libs/algolia/analytics/SearchAnalyticsWrapper', () => ({
  useSearchAnalyticsState: () => ({ currentQueryID: 'abc123' }),
}))

describe('HorizontalOfferTile component', () => {
  it('should navigate to the offer when pressing an offer', async () => {
    render(
      reactQueryProviderHOC(
        // @ts-expect-error: because of noUncheckedIndexedAccess
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )

    fireEvent.press(screen.getByRole('link'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Offer', {
        id: offerId,
        from: 'search',
        searchId: '539b285e',
      })
    })
  })

  it('should log analytics event when pressing an offer', async () => {
    render(
      reactQueryProviderHOC(
        // @ts-expect-error: because of noUncheckedIndexedAccess
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )
    fireEvent.press(screen.getByRole('link'))

    expect(analytics.logConsultOffer).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'search',
      query: '',
      index: 0,
      searchId: '539b285e',
    })
  })

  it('should notify Algolia when pressing an offer', async () => {
    render(
      reactQueryProviderHOC(
        // @ts-expect-error: because of noUncheckedIndexedAccess
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )

    const hitComponent = screen.getByRole('link')
    fireEvent.press(hitComponent)

    expect(spyLogClickOnOffer).toHaveBeenCalledWith({
      objectID: '102280',
      position: 0,
    })
  })

  it('should show distance if geolocation enabled', () => {
    mockDistance = '10 km'
    render(
      reactQueryProviderHOC(
        // @ts-expect-error: because of noUncheckedIndexedAccess
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )

    expect(screen.getByText('10 km')).toBeOnTheScreen()
  })

  describe('When pressing an offer without object id', () => {
    const offer = { ...mockOffer, objectID: '' }

    it('should not navigate to the offer', async () => {
      render(
        reactQueryProviderHOC(
          // @ts-expect-error: because of noUncheckedIndexedAccess
          <HorizontalOfferTile offer={offer} analyticsParams={mockAnalyticsParams} />
        )
      )
      fireEvent.press(screen.getByRole('link'))

      expect(navigate).not.toHaveBeenCalled()
    })

    it('should not log analytics event', async () => {
      render(
        reactQueryProviderHOC(
          // @ts-expect-error: because of noUncheckedIndexedAccess
          <HorizontalOfferTile offer={offer} analyticsParams={mockAnalyticsParams} />
        )
      )
      fireEvent.press(screen.getByRole('link'))

      expect(analytics.logConsultOffer).not.toHaveBeenCalled()
    })
  })
})
