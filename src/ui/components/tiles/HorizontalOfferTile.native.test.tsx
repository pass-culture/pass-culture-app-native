import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import * as logClickOnProductAPI from 'libs/algolia/analytics/logClickOnOffer'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useDistance } from 'libs/location/hooks/useDistance'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { HorizontalOfferTile } from './HorizontalOfferTile'

const mockOffer = mockedAlgoliaResponse.hits[0]
const offerId = Number(mockOffer.objectID)
const mockAnalyticsParams: OfferAnalyticsParams = {
  from: 'searchresults',
  query: '',
  index: 0,
  searchId: '539b285e',
}

jest.mock('libs/location/hooks/useDistance')
const mockUseDistance = useDistance as jest.Mock
mockUseDistance.mockReturnValue(null)

const spyLogClickOnOffer = jest.fn()
const mockUseLogClickOnOffer = jest.spyOn(logClickOnProductAPI, 'useLogClickOnOffer')
mockUseLogClickOnOffer.mockReturnValue({ logClickOnOffer: spyLogClickOnOffer })

jest.mock('libs/algolia/analytics/SearchAnalyticsWrapper', () => ({
  useSearchAnalyticsState: () => ({ currentQueryID: 'abc123' }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('HorizontalOfferTile component', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, subcategoriesDataTest)
  })

  it('should navigate to the offer when pressing an offer', async () => {
    render(
      reactQueryProviderHOC(
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )

    fireEvent.press(screen.getByRole('link'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Offer', {
        id: offerId,
        from: 'searchresults',
        searchId: '539b285e',
      })
    })
  })

  it('should log analytics event when pressing an offer', async () => {
    render(
      reactQueryProviderHOC(
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )
    fireEvent.press(screen.getByRole('link'))

    await waitFor(() => {
      expect(analytics.logConsultOffer).toHaveBeenCalledTimes(1)
      expect(analytics.logConsultOffer).toHaveBeenCalledWith({
        offerId,
        from: 'searchresults',
        query: '',
        index: 0,
        searchId: '539b285e',
      })
    })
  })

  it('should notify Algolia when pressing an offer', async () => {
    render(
      reactQueryProviderHOC(
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )

    const hitComponent = screen.getByRole('link')
    fireEvent.press(hitComponent)

    await waitFor(() => {
      expect(spyLogClickOnOffer).toHaveBeenCalledWith({
        objectID: '102280',
        position: 0,
      })
    })
  })

  it('should show distance if geolocation enabled', async () => {
    mockUseDistance.mockReturnValueOnce('10 km')
    render(
      reactQueryProviderHOC(
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )
    await waitFor(() => {
      expect(screen.getByText('à 10 km')).toBeOnTheScreen()
    })
  })

  it('should not show distance if user has an unprecise location (type municipality or locality)', async () => {
    mockUseDistance.mockReturnValueOnce(null)
    render(
      reactQueryProviderHOC(
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )
    await waitFor(() => {
      expect(screen.getByText('La nuit des temps')).toBeOnTheScreen()
    })

    expect(screen.queryByText('à 10 km')).not.toBeOnTheScreen()
  })

  describe('When pressing an offer without object id', () => {
    const offer = { ...mockOffer, objectID: '' }

    it('should not navigate to the offer', async () => {
      render(
        reactQueryProviderHOC(
          <HorizontalOfferTile offer={offer} analyticsParams={mockAnalyticsParams} />
        )
      )
      fireEvent.press(screen.getByRole('link'))

      await waitFor(() => {
        expect(navigate).not.toHaveBeenCalled()
      })
    })

    it('should not log analytics event', async () => {
      render(
        reactQueryProviderHOC(
          <HorizontalOfferTile offer={offer} analyticsParams={mockAnalyticsParams} />
        )
      )
      fireEvent.press(screen.getByRole('link'))

      await waitFor(() => {
        expect(analytics.logConsultOffer).not.toHaveBeenCalled()
      })
    })
  })
})
