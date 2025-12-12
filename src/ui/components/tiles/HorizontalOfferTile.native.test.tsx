import mockdate from 'mockdate'
import React from 'react'

import { navigate, useNavigationState } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2, SubcategoryIdEnum } from 'api/gen'
import * as logClickOnProductAPI from 'libs/algolia/analytics/logClickOnOffer'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { UserProps } from 'libs/location/getDistance'
import { LocationMode, Position } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { HorizontalOfferTile } from './HorizontalOfferTile'

type Props = UserProps & { geolocPosition: Position | undefined }

const mockOffer = mockedAlgoliaResponse.hits[0]
const offerId = Number(mockOffer.objectID)
const mockAnalyticsParams: OfferAnalyticsParams = {
  from: 'searchresults',
  query: '',
  index: 0,
  searchId: '539b285e',
}

const spyLogClickOnOffer = jest.spyOn(logClickOnProductAPI, 'logClickOnOffer')

jest.mock('libs/firebase/analytics/analytics')

const DEFAULT_USER_LOCATION = { latitude: 48, longitude: 2 }

const EVERYWHERE_USER_POSITION: Props = {
  userLocation: null,
  selectedPlace: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  geolocPosition: undefined,
}

const EVERYWHERE_WITH_GEOLOC_USER_POSITION: Props = {
  userLocation: null,
  selectedPlace: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  geolocPosition: DEFAULT_USER_LOCATION,
}

const AROUND_ME_POSITION: Props = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: null,
  selectedLocationMode: LocationMode.AROUND_ME,
  geolocPosition: DEFAULT_USER_LOCATION,
}

const DEFAULT_SELECTED_PLACE: SuggestedPlace | null = {
  type: 'municipality',
  label: 'Kourou',
  info: 'Kourou',
  geolocation: DEFAULT_USER_LOCATION,
}
const MUNICIPALITY_AROUND_PLACE_POSITION: Props = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: DEFAULT_SELECTED_PLACE,
  selectedLocationMode: LocationMode.AROUND_PLACE,
  geolocPosition: undefined,
}
const AROUND_PLACE_POSITION: Props = {
  ...MUNICIPALITY_AROUND_PLACE_POSITION,
  selectedPlace: { ...DEFAULT_SELECTED_PLACE, type: 'housenumber' },
}

const mockUseLocation = jest.fn(() => EVERYWHERE_USER_POSITION)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const defaultProps = {
  offer: mockOffer,
  analyticsParams: mockAnalyticsParams,
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('HorizontalOfferTile component', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, subcategoriesDataTest)
  })

  it('should navigate to the offer when pressing an offer', async () => {
    renderHorizontalOfferTile(defaultProps)

    await user.press(screen.getByText('La nuit des temps'))

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
    await user.press(screen.getByText('La nuit des temps'))

    await screen.findByText(mockOffer.offer.name)

    expect(analytics.logConsultOffer).toHaveBeenNthCalledWith(1, {
      offerId: String(offerId),
      from: 'searchresults',
      query: '',
      index: 0,
      searchId: '539b285e',
      isHeadline: false,
      displayVideo: true,
    })
  })

  it('should notify Algolia when pressing an offer', async () => {
    renderHorizontalOfferTile(defaultProps)

    const hitComponent = screen.getByText('La nuit des temps')
    await user.press(hitComponent)

    await screen.findByText(mockOffer.offer.name)

    expect(spyLogClickOnOffer).toHaveBeenCalledWith({
      objectID: '102280',
      position: 0,
    })
  })

  describe('When pressing an offer without object id', () => {
    const offer = { ...mockOffer, objectID: '' }

    it('should not navigate to the offer', async () => {
      renderHorizontalOfferTile({
        offer,
        analyticsParams: mockAnalyticsParams,
      })

      await user.press(screen.getByText('La nuit des temps'))

      await screen.findByText(mockOffer.offer.name)

      expect(navigate).not.toHaveBeenCalled()
    })

    it('should not log analytics event', async () => {
      renderHorizontalOfferTile({
        offer,
        analyticsParams: mockAnalyticsParams,
      })

      await user.press(screen.getByText('La nuit des temps'))

      await screen.findByText(mockOffer.offer.name)

      expect(analytics.logConsultOffer).not.toHaveBeenCalled()
    })
  })

  describe('When offer is a `SEANCE_CINE`', () => {
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

  describe('distances', () => {
    describe('onSearchResults', () => {
      useNavigationState.mockImplementation(() => [{ name: 'SearchResults' }])

      describe('user has chosen FranceEntière', () => {
        beforeEach(() => {
          mockUseLocation.mockReturnValue(EVERYWHERE_USER_POSITION)
        })

        it('should not show distance', async () => {
          renderHorizontalOfferTile(defaultProps)

          await screen.findByText('La nuit des temps')

          expect(screen.queryByText('à 111 km')).not.toBeOnTheScreen()
        })
      })

      describe('user has chosen FranceEntière but has geolocation activated', () => {
        beforeEach(() => {
          mockUseLocation.mockReturnValue(EVERYWHERE_WITH_GEOLOC_USER_POSITION)
        })

        it('should show distance', async () => {
          renderHorizontalOfferTile(defaultProps)

          await screen.findByText('La nuit des temps')

          expect(screen.getByText('à 111 km')).toBeOnTheScreen()
        })
      })
    })

    describe('user has chosen FranceEntière but has geolocation activated', () => {
      beforeEach(() => {
        mockUseLocation.mockReturnValue(EVERYWHERE_WITH_GEOLOC_USER_POSITION)
      })

      it('should not show distance', async () => {
        renderHorizontalOfferTile(defaultProps)

        await screen.findByText('La nuit des temps')

        expect(screen.getByText('à 111 km')).toBeOnTheScreen()
      })
    })

    describe('user has chosen geolocation', () => {
      beforeEach(() => {
        mockUseLocation.mockReturnValue(AROUND_ME_POSITION)
      })

      it('should show distance', async () => {
        renderHorizontalOfferTile(defaultProps)

        expect(await screen.findByText('à 111 km')).toBeOnTheScreen()
      })
    })

    describe('user has an unprecise location (type municipality or locality)', () => {
      beforeEach(() => {
        mockUseLocation.mockReturnValue(MUNICIPALITY_AROUND_PLACE_POSITION)
      })

      it('should not show distance', async () => {
        renderHorizontalOfferTile(defaultProps)

        await screen.findByText('La nuit des temps')

        expect(screen.queryByText('à 111 km')).not.toBeOnTheScreen()
      })
    })

    describe('user has a precise location (type housenumber or street)', () => {
      beforeEach(() => {
        mockUseLocation.mockReturnValue(AROUND_PLACE_POSITION)
      })

      it('should show distance', async () => {
        renderHorizontalOfferTile(defaultProps)
        await screen.findByText('La nuit des temps')

        expect(screen.getByText('à 111 km')).toBeOnTheScreen()
      })
    })

    describe('coming soon offer', () => {
      const bookingAllowedDatetime = 1753886400 // '2025-07-30T14:00:00+02:00'
      const mockComingSoonOffer = {
        ...mockOffer,
        offer: { ...mockOffer.offer, bookingAllowedDatetime },
      }

      beforeEach(jest.fn())

      it('should display coming soon tag', async () => {
        renderHorizontalOfferTile({ ...defaultProps, offer: mockComingSoonOffer })
        await screen.findByText('La nuit des temps')

        expect(await screen.findByText('Bientôt dispo')).toBeOnTheScreen()
      })
    })
  })
})

function renderHorizontalOfferTile(props: { offer: Offer; analyticsParams: OfferAnalyticsParams }) {
  return render(reactQueryProviderHOC(<HorizontalOfferTile {...props} />))
}
