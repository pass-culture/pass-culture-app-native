import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2, SubcategoryIdEnum } from 'api/gen'
import * as logClickOnProductAPI from 'libs/algolia/analytics/logClickOnOffer'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useDistance } from 'libs/location/hooks/useDistance'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

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

describe('HorizontalOfferTile component', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, subcategoriesDataTest)
  })

  it('should navigate to the offer when pressing an offer', async () => {
    renderHorizontalOfferTile({
      offer: mockOffer,
      analyticsParams: mockAnalyticsParams,
    })

    fireEvent.press(screen.getByRole('link'))

    await screen.findByText(mockOffer.offer.name)

    expect(navigate).toHaveBeenCalledWith('Offer', {
      id: offerId,
      from: 'searchresults',
      searchId: '539b285e',
    })
  })

  it('should log analytics event when pressing an offer', async () => {
    render(
      reactQueryProviderHOC(
        <HorizontalOfferTile offer={mockOffer} analyticsParams={mockAnalyticsParams} />
      )
    )
    fireEvent.press(screen.getByRole('link'))

    await screen.findByText(mockOffer.offer.name)

    expect(analytics.logConsultOffer).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      offerId,
      from: 'searchresults',
      query: '',
      index: 0,
      searchId: '539b285e',
    })
  })

  it('should notify Algolia when pressing an offer', async () => {
    renderHorizontalOfferTile({
      offer: mockOffer,
      analyticsParams: mockAnalyticsParams,
    })

    const hitComponent = screen.getByRole('link')
    fireEvent.press(hitComponent)

    await screen.findByText(mockOffer.offer.name)

    expect(spyLogClickOnOffer).toHaveBeenCalledWith({
      objectID: '102280',
      position: 0,
    })
  })

  it('should show distance if geolocation enabled', async () => {
    mockUseDistance.mockReturnValueOnce('10 km')

    renderHorizontalOfferTile({
      offer: mockOffer,
      analyticsParams: mockAnalyticsParams,
    })

    expect(await screen.findByText('à 10 km')).toBeOnTheScreen()
  })

  it('should not show distance if user has an unprecise location (type municipality or locality)', async () => {
    mockUseDistance.mockReturnValueOnce(null)
    renderHorizontalOfferTile({
      offer: mockOffer,
      analyticsParams: mockAnalyticsParams,
    })

    expect(await screen.findByText('La nuit des temps')).toBeOnTheScreen()

    expect(screen.queryByText('à 10 km')).not.toBeOnTheScreen()
  })

  describe('When pressing an offer without object id', () => {
    const offer = { ...mockOffer, objectID: '' }

    it('should not navigate to the offer', async () => {
      renderHorizontalOfferTile({
        offer,
        analyticsParams: mockAnalyticsParams,
      })

      fireEvent.press(screen.getByRole('link'))

      await screen.findByText(mockOffer.offer.name)

      expect(navigate).not.toHaveBeenCalled()
    })

    it('should not log analytics event', async () => {
      renderHorizontalOfferTile({
        offer,
        analyticsParams: mockAnalyticsParams,
      })

      fireEvent.press(screen.getByRole('link'))

      await screen.findByText(mockOffer.offer.name)

      expect(analytics.logConsultOffer).not.toHaveBeenCalled()
    })
  })

  describe('When offer is a `SEANCE_CINE`', () => {
    const defaultMovieName = 'La petite sirène'
    const defaultMovieScreeningOffer = {
      ...mockOffer.offer,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      name: defaultMovieName,
    }

    it('should format releaseDate when a valid one is given', async () => {
      const validReleaseDate = 1722988800 // 7 août 2024

      const movieScreeningOfferWithValidReleaseDate = {
        ...mockOffer,
        offer: {
          ...defaultMovieScreeningOffer,
          releaseDate: validReleaseDate,
        },
      }

      renderHorizontalOfferTile({
        offer: movieScreeningOfferWithValidReleaseDate,
        analyticsParams: mockAnalyticsParams,
      })

      await screen.findByText(defaultMovieName)

      expect(await screen.findByText('Sorti le 7 août 2024')).toBeOnTheScreen()
    })

    it('should not format releaseDate when an invalid one is given', async () => {
      const invalidReleaseDate = '1722988800'
      const movieScreeningOfferWithInvalidReleaseDate = {
        ...mockOffer,
        offer: {
          ...defaultMovieScreeningOffer,
          releaseDate: invalidReleaseDate,
        },
      }

      renderHorizontalOfferTile({
        offer: movieScreeningOfferWithInvalidReleaseDate,
        analyticsParams: mockAnalyticsParams,
      })

      await screen.findByText(defaultMovieName)

      expect(screen.queryByText('Sorti le 7 août 2024')).not.toBeOnTheScreen()
    })

    it('should format dates when no releaseDate is given', async () => {
      const movieScreeningOfferWithoutReleaseDate = {
        ...mockOffer,
        offer: {
          ...defaultMovieScreeningOffer,
          dates: [1732721400], // 27 novembre 2024
        },
      }

      renderHorizontalOfferTile({
        offer: movieScreeningOfferWithoutReleaseDate,
        analyticsParams: mockAnalyticsParams,
      })

      await screen.findByText(defaultMovieName)

      expect(await screen.findByText('27 novembre 2024')).toBeOnTheScreen()
    })
  })
})

function renderHorizontalOfferTile(props: { offer: Offer; analyticsParams: OfferAnalyticsParams }) {
  return render(reactQueryProviderHOC(<HorizontalOfferTile {...props} />))
}
