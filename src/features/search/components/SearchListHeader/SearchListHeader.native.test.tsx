import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { useRoute } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { mockedAlgoliaVenueResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { act, render, screen } from 'tests/utils'

import { SearchListHeader } from './SearchListHeader'

const searchId = uuidv4()

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/geolocation/LocationWrapper', () => ({
  useLocation: () => ({
    userPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

const mockSearchVenuesState = {
  ...mockedAlgoliaVenueResponse,
  hits: [
    ...mockedAlgoliaVenueResponse.hits,

    {
      audio_disability: false,
      banner_url:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
      city: 'Bordeaux',
      date_created: 1692605431.220722,
      description: '',
      email: null,
      facebook: null,
      has_at_least_one_bookable_offer: true,
      instagram: null,
      mental_disability: false,
      motor_disability: false,
      name: 'EMS 0063 (ne fonctionne pas)',
      objectID: '7931',
      offerer_name: 'Structure du cinéma EMS',
      phone_number: null,
      snapchat: null,
      tags: [],
      twitter: null,
      venue_type: 'MOVIE',
      visual_disability: false,
      website: null,
      _geoloc: { lat: 44.82186, lng: -0.56366 },
    },

    {
      audio_disability: false,
      banner_url:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/darya-tryfanava-UCNaGWn4EfU-unsplash.jpg',
      city: 'Paris',
      date_created: 1692268069.917432,
      description: '',
      email: null,
      facebook: null,
      has_at_least_one_bookable_offer: false,
      instagram: null,
      mental_disability: false,
      motor_disability: false,
      name: 'ETABLISSEMENT PUBLIC DU MUSEE DU LOUVRE',
      objectID: '7929',
      offerer_name: 'ETABLISSEMENT PUBLIC DU MUSEE DU LOUVRE',
      phone_number: null,
      snapchat: null,
      tags: [],
      twitter: null,
      venue_type: 'VISUAL_ARTS',
      visual_disability: false,
      website: null,
      _geoloc: { lat: 48.85959, lng: 2.33561 },
    },

    {
      audio_disability: false,
      banner_url:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/uxuipc_High_angle_avec_un_Canon_R5_50_mm_DSLR_planetarium_with__f16e10f2-eb38-4314-b5f2-784819f04c05%20(1).png',
      city: 'Bordeaux',
      date_created: 1692200059.334066,
      description: '',
      email: null,
      facebook: null,
      has_at_least_one_bookable_offer: false,
      instagram: null,
      mental_disability: false,
      motor_disability: false,
      name: 'culture scientifique 2',
      objectID: '7927',
      offerer_name: '0 - Structure avec justificatif copieux',
      phone_number: null,
      snapchat: null,
      tags: [],
      twitter: null,
      venue_type: 'SCIENTIFIC_CULTURE',
      visual_disability: false,
      website: null,
      _geoloc: { lat: 44.85597, lng: -0.63444 },
    },

    {
      audio_disability: false,
      banner_url:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/edd_Medium-Shot_avec_un_Canon_R5_50_mm_DSLR_Science_class_with__0251a3c2-c494-4b61-8116-a22c61848947%20(1).png',
      city: 'Marseille',
      date_created: 1692200009.367894,
      description: '',
      email: null,
      facebook: null,
      has_at_least_one_bookable_offer: true,
      instagram: null,
      mental_disability: false,
      motor_disability: false,
      name: 'culture scientifique 1',
      objectID: '7926',
      offerer_name: '0 - Structure avec justificatif copieux',
      phone_number: null,
      snapchat: null,
      tags: [],
      twitter: null,
      venue_type: 'SCIENTIFIC_CULTURE',
      visual_disability: false,
      website: null,
      _geoloc: { lat: 43.3112, lng: 5.3832 },
    },

    {
      audio_disability: true,
      banner_url:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/amy-leigh-barnard-H3APOiYLyzk-unsplashed.png',
      city: 'Paris',
      date_created: 1692194137.337759,
      description: '',
      email: null,
      facebook: null,
      has_at_least_one_bookable_offer: true,
      instagram: null,
      mental_disability: true,
      motor_disability: true,
      name: 'musee test2',
      objectID: '7924',
      offerer_name: '0 - Structure avec justificatif copieux',
      phone_number: null,
      snapchat: null,
      tags: [],
      twitter: null,
      venue_type: 'MUSEUM',
      visual_disability: true,
      website: null,
      _geoloc: { lat: 48.84303, lng: 2.30445 },
    },

    {
      audio_disability: false,
      banner_url:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/erik-mclean-PFfA3xlHFbQ-unsplash_(1).png',
      city: 'Paris',
      date_created: 1692055849.239477,
      description: 'Them bill possible decision wide claim so.',
      email: 'contact@venue.com',
      facebook: null,
      has_at_least_one_bookable_offer: true,
      instagram: 'http://instagram.com/@venue',
      mental_disability: false,
      motor_disability: false,
      name: 'Le Sous-sol DATA',
      objectID: '7922',
      offerer_name: 'Herbert Marcuse Entreprise',
      phone_number: '+33102030405',
      snapchat: null,
      tags: [],
      twitter: null,
      venue_type: 'PERFORMING_ARTS',
      visual_disability: false,
      website: 'https://my.website.com',
      _geoloc: { lat: 50.63111, lng: 3.0716 },
    },
  ],
}
jest.mock('features/search/context/SearchVenuesWrapper', () => ({
  useSearchVenues: () => ({
    searchVenuesState: mockSearchVenuesState,
    dispatch: jest.fn(),
  }),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

const kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('<SearchListHeader />', () => {
  it('should display the number of results', () => {
    useRoute.mockReturnValueOnce({
      params: { searchId },
    })
    render(<SearchListHeader nbHits={10} userData={[]} />)

    expect(screen.getByText('10 résultats')).toBeOnTheScreen()
  })

  it('should not display the geolocation button if position is not null', () => {
    render(<SearchListHeader nbHits={10} userData={[]} />)
    expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
  })

  it('should display the geolocation incitation button when position is null', () => {
    mockPosition = null
    render(<SearchListHeader nbHits={10} userData={[]} />)

    expect(screen.getByText('Géolocalise-toi')).toBeOnTheScreen()
  })

  it('should display paddingBottom when nbHits is greater than 0', () => {
    render(<SearchListHeader nbHits={10} userData={[{ message: 'message test' }]} />)
    const bannerContainer = screen.getByTestId('banner-container')
    expect(bannerContainer.props.style).toEqual([{ paddingBottom: 16, paddingHorizontal: 24 }])
  })

  it('should not display paddingBottom when nbHits is equal to 0', () => {
    render(<SearchListHeader nbHits={0} userData={[{ message: 'message test' }]} />)
    const bannerContainer = screen.getByTestId('banner-container')
    expect(bannerContainer.props.style).not.toEqual([{ paddingBottom: 16, paddingHorizontal: 24 }])
  })

  describe('When wipEnableVenuesInSearchResults feature flag activated', () => {
    it('should render venue items when there are venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)
      expect(screen.getByTestId('search-venue-list')).toBeOnTheScreen()
    })

    it('should render venues nbHits', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.getByText('8 résultats')).toBeOnTheScreen()
    })

    it.each`
      locationFilter                                                                   | isGeolocated | locationType
      ${undefined}                                                                     | ${false}     | ${undefined}
      ${{ locationType: LocationType.EVERYWHERE }}                                     | ${false}     | ${LocationType.EVERYWHERE}
      ${{ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }}            | ${true}      | ${LocationType.AROUND_ME}
      ${{ locationType: LocationType.PLACE, place: kourou, aroundRadius: MAX_RADIUS }} | ${true}      | ${LocationType.PLACE}
    `(
      'should trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is $locationType with isGeolocated param = $isGeolocated',
      ({ locationFilter, isGeolocated }) => {
        useRoute.mockReturnValueOnce({
          params: { searchId, locationFilter },
        })
        render(<SearchListHeader nbHits={10} userData={[]} />)
        expect(analytics.logVenuePlaylistDisplayedOnSearchResults).toHaveBeenNthCalledWith(1, {
          isGeolocated,
          searchId: 'testUuidV4',
          searchNbResults: 8,
        })
      }
    )

    it('should not trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is VENUE with isGeolocated param = true', () => {
      useRoute.mockReturnValueOnce({
        params: { searchId, locationFilter: { locationType: LocationType.VENUE } },
      })
      render(<SearchListHeader nbHits={10} userData={[]} />)
      expect(analytics.logVenuePlaylistDisplayedOnSearchResults).not.toHaveBeenCalled()
    })

    it('should trigger AllTilesSeen log when there are venues', async () => {
      useRoute.mockReturnValueOnce({
        params: { searchId },
      })
      render(<SearchListHeader nbHits={10} userData={[]} />)

      const scrollView = screen.getByTestId('search-venue-list')
      await act(async () => {
        // 1st scroll to last item => trigger
        await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      })

      expect(analytics.logAllTilesSeen).toHaveBeenNthCalledWith(1, {
        searchId: 'testUuidV4',
      })

      scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)
    })

    it('should not render venue items when there are not venues', () => {
      mockSearchVenuesState.hits = []
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByTestId('search-venue-list')).not.toBeOnTheScreen()
    })

    it('should not render venues nbHits', () => {
      mockSearchVenuesState.hits = []
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByText('2 résultats')).not.toBeOnTheScreen()
    })

    it('should not trigger VenuePlaylistDisplayedOnSearchResults log when there are not venues', () => {
      mockSearchVenuesState.hits = []
      render(<SearchListHeader nbHits={10} userData={[]} />)
      expect(analytics.logVenuePlaylistDisplayedOnSearchResults).not.toHaveBeenCalled()
    })

    it('should not trigger AllTilesSeen log when there are not venues', () => {
      useRoute.mockReturnValueOnce({
        params: { searchId },
      })
      mockSearchVenuesState.hits = []
      render(<SearchListHeader nbHits={10} userData={[]} />)
      expect(analytics.logAllTilesSeen).not.toHaveBeenCalled()
    })
  })

  describe('When wipEnableVenuesInSearchResults feature flag deactivated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValue(false)
    })

    it('should not render venue items when there are venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByTestId('search-venue-list')).not.toBeOnTheScreen()
    })

    it('should not render venues nbHits when there are venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByText('2 résultats')).not.toBeOnTheScreen()
    })

    it('should not render venue items when we search from venues', () => {
      useRoute.mockReturnValueOnce({
        params: { locationFilter: { locationType: LocationType.VENUE } },
      })
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByTestId('search-venue-list')).not.toBeOnTheScreen()
    })

    it('should not render venues nbHits when there are not venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)

      expect(screen.queryByText('2 résultats')).not.toBeOnTheScreen()
    })

    it('should not trigger VenuePlaylistDisplayedOnSearchResults log when received venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} />)
      expect(analytics.logVenuePlaylistDisplayedOnSearchResults).not.toHaveBeenCalled()
    })

    it('should not trigger AllTilesSeen log when there are venues', () => {
      useRoute.mockReturnValueOnce({
        params: { searchId },
      })
      render(<SearchListHeader nbHits={10} userData={[]} />)
      expect(analytics.logAllTilesSeen).not.toHaveBeenCalled()
    })
  })
})
