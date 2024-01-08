import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { initialSearchState } from 'features/search/context/reducer'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { AlgoliaVenue } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { GeoCoordinates } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place'
import { act, render, screen } from 'tests/utils'

import { SearchListHeader } from './SearchListHeader'

const searchId = uuidv4()

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()
let mockSelectedLocationMode = LocationMode.EVERYWHERE

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
    selectedLocationMode: mockSelectedLocationMode,
  }),
}))

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

const mockVenues: AlgoliaVenue[] = [
  {
    audio_disability: false,
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
    city: 'Bordeaux',
    description: '',
    email: null,
    facebook: null,

    instagram: null,
    mental_disability: false,
    motor_disability: false,
    name: 'EMS 0063 (ne fonctionne pas)',
    objectID: '7931',
    offerer_name: 'Structure du cinéma EMS',
    phone_number: null,
    snapchat: null,
    twitter: null,
    venue_type: 'MOVIE',
    visual_disability: false,
    website: null,
    _geoloc: { lat: 44.82186, lng: -0.56366 },
    postalCode: '75000',
  },

  {
    audio_disability: false,
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/darya-tryfanava-UCNaGWn4EfU-unsplash.jpg',
    city: 'Paris',
    description: '',
    email: null,
    facebook: null,
    instagram: null,
    mental_disability: false,
    motor_disability: false,
    name: 'ETABLISSEMENT PUBLIC DU MUSEE DU LOUVRE',
    objectID: '7929',
    offerer_name: 'ETABLISSEMENT PUBLIC DU MUSEE DU LOUVRE',
    phone_number: null,
    snapchat: null,
    twitter: null,
    venue_type: 'VISUAL_ARTS',
    visual_disability: false,
    website: null,
    _geoloc: { lat: 48.85959, lng: 2.33561 },
    postalCode: '75000',
  },

  {
    audio_disability: false,
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/uxuipc_High_angle_avec_un_Canon_R5_50_mm_DSLR_planetarium_with__f16e10f2-eb38-4314-b5f2-784819f04c05%20(1).png',
    city: 'Bordeaux',
    description: '',
    email: null,
    facebook: null,
    instagram: null,
    mental_disability: false,
    motor_disability: false,
    name: 'culture scientifique 2',
    objectID: '7927',
    offerer_name: '0 - Structure avec justificatif copieux',
    phone_number: null,
    snapchat: null,
    twitter: null,
    venue_type: 'SCIENTIFIC_CULTURE',
    visual_disability: false,
    website: null,
    _geoloc: { lat: 44.85597, lng: -0.63444 },
    postalCode: '75000',
  },

  {
    audio_disability: false,
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/edd_Medium-Shot_avec_un_Canon_R5_50_mm_DSLR_Science_class_with__0251a3c2-c494-4b61-8116-a22c61848947%20(1).png',
    city: 'Marseille',
    description: '',
    email: null,
    facebook: null,
    instagram: null,
    mental_disability: false,
    motor_disability: false,
    name: 'culture scientifique 1',
    objectID: '7926',
    offerer_name: '0 - Structure avec justificatif copieux',
    phone_number: null,
    snapchat: null,
    twitter: null,
    venue_type: 'SCIENTIFIC_CULTURE',
    visual_disability: false,
    website: null,
    _geoloc: { lat: 43.3112, lng: 5.3832 },
    postalCode: '75000',
  },

  {
    audio_disability: true,
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/amy-leigh-barnard-H3APOiYLyzk-unsplashed.png',
    city: 'Paris',
    description: '',
    email: null,
    facebook: null,
    instagram: null,
    mental_disability: true,
    motor_disability: true,
    name: 'musee test2',
    objectID: '7924',
    offerer_name: '0 - Structure avec justificatif copieux',
    phone_number: null,
    snapchat: null,
    twitter: null,
    venue_type: 'MUSEUM',
    visual_disability: true,
    website: null,
    _geoloc: { lat: 48.84303, lng: 2.30445 },
    postalCode: '75000',
  },

  {
    audio_disability: false,
    banner_url:
      'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/erik-mclean-PFfA3xlHFbQ-unsplash_(1).png',
    city: 'Paris',
    description: 'Them bill possible decision wide claim so.',
    email: 'contact@venue.com',
    facebook: null,
    instagram: 'http://instagram.com/@venue',
    mental_disability: false,
    motor_disability: false,
    name: 'Le Sous-sol DATA',
    objectID: '7922',
    offerer_name: 'Herbert Marcuse Entreprise',
    phone_number: '+33102030405',
    snapchat: null,
    twitter: null,
    venue_type: 'PERFORMING_ARTS',
    visual_disability: false,
    website: 'https://my.website.com',
    _geoloc: { lat: 50.63111, lng: 3.0716 },
    postalCode: '75000',
  },
]

const kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

let mockSearchState: SearchState = initialSearchState

const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

describe('<SearchListHeader />', () => {
  afterEach(() => {
    mockSearchState = initialSearchState
    mockSelectedLocationMode = LocationMode.EVERYWHERE
  })

  it('should display the number of results', () => {
    mockSearchState = { ...mockSearchState, searchId }

    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockVenues} />)

    expect(screen.getByText('10 résultats')).toBeOnTheScreen()
  })

  it('should show correct title when NO userData exists', () => {
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockVenues} />)

    expect(screen.queryByText('Les lieux culturels')).toBeOnTheScreen()
  })

  it('should show correct title when userData exists', () => {
    render(
      <SearchListHeader
        nbHits={10}
        userData={[]}
        venuesUserData={[{ venue_playlist_title: 'test' }]}
        venues={mockVenues}
      />
    )

    expect(screen.queryByText('Les lieux culturels')).not.toBeOnTheScreen()
    expect(screen.queryByText('test')).toBeOnTheScreen()
  })

  it('should not display the geolocation button if position is not null', () => {
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockVenues} />)

    expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
  })

  it('should display the geolocation incitation button when position is null', () => {
    mockPosition = null
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockVenues} />)

    expect(screen.getByText('Géolocalise-toi')).toBeOnTheScreen()
  })

  it('should display paddingBottom when nbHits is greater than 0', () => {
    render(
      <SearchListHeader nbHits={10} userData={[{ message: 'message test' }]} venuesUserData={[]} />
    )
    const bannerContainer = screen.getByTestId('banner-container')

    expect(bannerContainer.props.style).toEqual([{ paddingBottom: 16, paddingHorizontal: 24 }])
  })

  it('should not display paddingBottom when nbHits is equal to 0', () => {
    render(
      <SearchListHeader nbHits={0} userData={[{ message: 'message test' }]} venuesUserData={[]} />
    )
    const bannerContainer = screen.getByTestId('banner-container')

    expect(bannerContainer.props.style).not.toEqual([{ paddingBottom: 16, paddingHorizontal: 24 }])
  })

  it('should render venue items when there are venues', () => {
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockVenues} />)

    expect(screen.getByTestId('search-venue-list')).toBeOnTheScreen()
  })

  it('should render venues nbHits', () => {
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockVenues} />)

    expect(screen.getByText('6 résultats')).toBeOnTheScreen()
  })

  it.each`
    locationFilter                                                                          | isLocated | locationType
    ${undefined}                                                                            | ${false}  | ${undefined}
    ${{ locationType: LocationMode.EVERYWHERE }}                                            | ${false}  | ${LocationMode.EVERYWHERE}
    ${{ locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS }}                   | ${true}   | ${LocationMode.AROUND_ME}
    ${{ locationType: LocationMode.AROUND_PLACE, place: kourou, aroundRadius: MAX_RADIUS }} | ${true}   | ${LocationMode.AROUND_PLACE}
  `(
    'should trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is $locationType with isLocated param = $isLocated',
    ({ locationFilter, isLocated }) => {
      mockSearchState = { ...mockSearchState, searchId, locationFilter }
      mockSelectedLocationMode = locationFilter?.locationType ?? LocationMode.EVERYWHERE
      render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockVenues} />)

      expect(analytics.logVenuePlaylistDisplayedOnSearchResults).toHaveBeenNthCalledWith(1, {
        isLocated,
        searchId: 'testUuidV4',
        searchNbResults: 6,
      })
    }
  )

  it('should not trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is VENUE with isLocated param = true', () => {
    mockSearchState = { ...mockSearchState, searchId, venue: mockVenues[0] as unknown as Venue }
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockVenues} />)

    expect(analytics.logVenuePlaylistDisplayedOnSearchResults).not.toHaveBeenCalled()
  })

  it('should trigger AllTilesSeen log when there are venues', async () => {
    mockSearchState = { ...mockSearchState, searchId }
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockVenues} />)

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
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={[]} />)

    expect(screen.queryByTestId('search-venue-list')).not.toBeOnTheScreen()
  })

  it('should not render venues nbHits', () => {
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={[]} />)

    expect(screen.queryByText('2 résultats')).not.toBeOnTheScreen()
  })

  it('should not trigger VenuePlaylistDisplayedOnSearchResults log when there are not venues', () => {
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={[]} />)

    expect(analytics.logVenuePlaylistDisplayedOnSearchResults).not.toHaveBeenCalled()
  })

  it('should not trigger AllTilesSeen log when there are not venues', () => {
    mockSearchState = { ...mockSearchState, searchId }
    render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={[]} />)

    expect(analytics.logAllTilesSeen).not.toHaveBeenCalled()
  })
})
