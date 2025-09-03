import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueTypeCodeKey } from 'api/gen'
import { AlgoliaVenue, LocationMode } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { ILocationContext } from 'libs/location/location'
import { SuggestedPlace } from 'libs/place/types'
import { render, screen, userEvent } from 'tests/utils'

import { SearchVenueItem } from './SearchVenueItem'

const mockAlgoliaVenue: AlgoliaVenue = {
  objectID: '5543',
  name: 'UGC cinéma',
  city: 'Paris',
  postalCode: '75000',
  offerer_name: 'séance de cinéma chandra',
  venue_type: VenueTypeCodeKey.MOVIE,
  description: 'film',
  audio_disability: null,
  mental_disability: null,
  motor_disability: null,
  visual_disability: null,
  isPermanent: true,
  isOpenToPublic: true,
  email: null,
  phone_number: null,
  website: null,
  facebook: null,
  twitter: null,
  instagram: null,
  snapchat: null,
  banner_url: null,
  _geoloc: {
    lat: 48.1,
    lng: 1.9,
  },
}

const ITEM_HEIGHT = 96
const ITEM_WIDTH = 144
const searchId = uuidv4()

const DEFAULT_USER_LOCATION = { latitude: 48, longitude: 2 }
const DEFAULT_SELECTED_PLACE: SuggestedPlace | null = {
  type: 'municipality',
  label: 'Kourou',
  info: 'Kourou',
  geolocation: DEFAULT_USER_LOCATION,
}

const EVERYWHERE_USER_POSITION = {
  userLocation: null,
  selectedPlace: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  geolocPosition: undefined,
}

const AROUND_ME_POSITION = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: null,
  selectedLocationMode: LocationMode.AROUND_ME,
  geolocPosition: DEFAULT_USER_LOCATION,
  place: null,
}
const MUNICIPALITY_AROUND_PLACE_POSITION = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: DEFAULT_SELECTED_PLACE,
  selectedLocationMode: LocationMode.AROUND_PLACE,
  geolocPosition: undefined,
}

const mockUseLocation = jest.fn((): Partial<ILocationContext> => EVERYWHERE_USER_POSITION)
jest.mock('libs/location/location', () => ({
  useLocation: () => mockUseLocation(),
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SearchVenueItem />', () => {
  it('should render venue item correctly', () => {
    renderSearchVenueItem(mockAlgoliaVenue)

    expect(screen.getByText(mockAlgoliaVenue.name)).toBeOnTheScreen()
    expect(
      screen.getByText(`${mockAlgoliaVenue.city}, ${String(mockAlgoliaVenue.postalCode)}`)
    ).toBeOnTheScreen()
  })

  it('should log to analytics', async () => {
    renderSearchVenueItem(mockAlgoliaVenue, searchId)

    await user.press(screen.getByTestId(/Lieu/))

    expect(analytics.logConsultVenue).toHaveBeenCalledWith({
      venueId: mockAlgoliaVenue.objectID,
      searchId,
      from: 'searchVenuePlaylist',
    })
  })

  it('should render a venue type tile icon when banner_url is not provided', () => {
    renderSearchVenueItem(mockAlgoliaVenue)

    expect(screen.getByTestId('venue-type-tile')).toBeOnTheScreen()
  })

  it('should render a banner image when banner_url is provided', () => {
    const venueWithBanner = {
      ...mockAlgoliaVenue,
      banner_url:
        'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_magic_the_gathering_arena_01_1920x1080.jpg',
    }
    renderSearchVenueItem(venueWithBanner)

    expect(screen.getByTestId('tileImage')).toBeOnTheScreen()
  })

  it('should navigate to the venue when pressing a search venue item', async () => {
    renderSearchVenueItem(mockAlgoliaVenue, 'testUuidV4')
    await user.press(screen.getByTestId(/Lieu/))

    expect(navigate).toHaveBeenCalledWith('Venue', {
      id: Number(mockAlgoliaVenue.objectID),
      from: 'venue',
      searchId: 'testUuidV4',
    })
  })

  it('should display the distance when user choose geolocation', () => {
    mockUseLocation.mockReturnValueOnce(AROUND_ME_POSITION)

    renderSearchVenueItem(mockAlgoliaVenue)

    expect(screen.getByText('à 13 km')).toBeOnTheScreen()
  })

  it('should no display the distance tag when user chose an unprecise location (type municipality or locality)', () => {
    mockUseLocation.mockReturnValueOnce(MUNICIPALITY_AROUND_PLACE_POSITION)
    renderSearchVenueItem(mockAlgoliaVenue)

    expect(screen.queryByTestId('distance_tag')).not.toBeOnTheScreen()
  })

  it("should not display the distance tag when user chose 'France Entière'", () => {
    mockUseLocation.mockReturnValueOnce(EVERYWHERE_USER_POSITION)
    renderSearchVenueItem(mockAlgoliaVenue)

    expect(screen.queryByTestId('distance_tag')).not.toBeOnTheScreen()
  })

  it('should display only the city when postal code is null', () => {
    renderSearchVenueItem({ ...mockAlgoliaVenue, postalCode: null })

    expect(screen.getByText(mockAlgoliaVenue.city)).toBeOnTheScreen()
  })

  it('should display only the city when postal code is an empty string', () => {
    renderSearchVenueItem({ ...mockAlgoliaVenue, postalCode: '' })

    expect(screen.getByText(mockAlgoliaVenue.city)).toBeOnTheScreen()
  })
})

const renderSearchVenueItem = (venue: AlgoliaVenue, searchId?: string) => {
  render(
    <SearchVenueItem width={ITEM_WIDTH} height={ITEM_HEIGHT} venue={venue} searchId={searchId} />
  )
}
