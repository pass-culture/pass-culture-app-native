import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2, SubcategoryIdEnum } from 'api/gen'
import * as logClickOnProductAPI from 'libs/algolia/analytics/logClickOnOffer'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useDistance } from 'libs/location/hooks/useDistance'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen } from 'tests/utils'

import { HorizontalOfferTile } from './HorizontalOfferTile'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

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

const user = userEvent.setup()

describe('HorizontalOfferTile component', () => {
  jest.useFakeTimers()

  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, subcategoriesDataTest)
  })

  it('should navigate to the offer when pressing an offer', async () => {
    renderHorizontalOfferTile({
      offer: mockOffer,
      analyticsParams: mockAnalyticsParams,
    })

    user.press(screen.getByRole('link'))

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
    user.press(screen.getByRole('link'))

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
    user.press(hitComponent)

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

      user.press(screen.getByRole('link'))

      await screen.findByText(mockOffer.offer.name)

      expect(navigate).not.toHaveBeenCalled()
    })

    it('should not log analytics event', async () => {
      renderHorizontalOfferTile({
        offer,
        analyticsParams: mockAnalyticsParams,
      })

      user.press(screen.getByRole('link'))

      await screen.findByText(mockOffer.offer.name)

      expect(analytics.logConsultOffer).not.toHaveBeenCalled()
    })
  })

  describe('When offer is a `SEANCE_CINE`', () => {
    const OCTOBER_5_2020 = 1601856000
    const NOVEMBER_1_2020 = new Date(2020, 10, 1) // This date is used as now
    const NOVEMBER_12_2020 = 1605139200

    const defaultMovieName = 'La petite sirène'
    const defaultMovieScreeningOffer = {
      ...mockOffer.offer,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      name: defaultMovieName,
    }

    beforeEach(() => {
      mockdate.set(NOVEMBER_1_2020)
    })

    it('should format releaseDate when release date is before now', async () => {
      const movieScreeningOfferWithValidReleaseDate = {
        ...mockOffer,
        offer: {
          ...defaultMovieScreeningOffer,
          releaseDate: OCTOBER_5_2020,
        },
      }

      renderHorizontalOfferTile({
        offer: movieScreeningOfferWithValidReleaseDate,
        analyticsParams: mockAnalyticsParams,
      })

      await screen.findByText(defaultMovieName)

      expect(await screen.findByText('Sorti le 5 octobre 2020')).toBeOnTheScreen()
    })

    it('should format releaseDate when release date is after now', async () => {
      const movieScreeningOfferWithValidReleaseDate = {
        ...mockOffer,
        offer: {
          ...defaultMovieScreeningOffer,
          releaseDate: NOVEMBER_12_2020,
        },
      }

      renderHorizontalOfferTile({
        offer: movieScreeningOfferWithValidReleaseDate,
        analyticsParams: mockAnalyticsParams,
      })

      await screen.findByText(defaultMovieName)

      expect(await screen.findByText('Dès le 12 novembre 2020')).toBeOnTheScreen()
    })

    it('should not format releaseDate when an invalid one is given', async () => {
      const invalidReleaseDate = '1601856000'
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

      expect(screen.queryByText('Sorti le 5 octobre 2020')).not.toBeOnTheScreen()
    })

    it('should format dates when no releaseDate is given', async () => {
      const movieScreeningOfferWithoutReleaseDate = {
        ...mockOffer,
        offer: {
          ...defaultMovieScreeningOffer,
          dates: [NOVEMBER_12_2020],
        },
      }

      renderHorizontalOfferTile({
        offer: movieScreeningOfferWithoutReleaseDate,
        analyticsParams: mockAnalyticsParams,
      })

      await screen.findByText(defaultMovieName)

      expect(await screen.findByText('12 novembre 2020')).toBeOnTheScreen()
    })
  })
})

function renderHorizontalOfferTile(props: { offer: Offer; analyticsParams: OfferAnalyticsParams }) {
  return render(reactQueryProviderHOC(<HorizontalOfferTile {...props} />))


  const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
    useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
  }
