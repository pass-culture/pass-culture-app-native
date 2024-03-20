import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueTypeCodeKey } from 'api/gen'
import { AlgoliaVenue } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { SearchVenueItem } from './SearchVenueItem'

let mockDistance: string | null = null
jest.mock('libs/location/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

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
  email: null,
  phone_number: null,
  website: null,
  facebook: null,
  twitter: null,
  instagram: null,
  snapchat: null,
  banner_url: null,
  _geoloc: {
    lat: null,
    lng: null,
  },
}

const ITEM_HEIGHT = 96
const ITEM_WIDTH = 144
const searchId = uuidv4()

describe('<SearchVenueItem />', () => {
  it('should render venue item correctly', () => {
    render(<SearchVenueItem venue={mockAlgoliaVenue} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.getByText(mockAlgoliaVenue.name)).toBeOnTheScreen()
    expect(
      screen.getByText(`${mockAlgoliaVenue.city}, ${mockAlgoliaVenue.postalCode}`)
    ).toBeOnTheScreen()
  })

  it('should log to analytics', async () => {
    render(
      <SearchVenueItem
        venue={mockAlgoliaVenue}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        searchId={searchId}
      />
    )

    fireEvent.press(screen.getByTestId(/Lieu/))

    await waitFor(() => {
      expect(analytics.logConsultVenue).toHaveBeenCalledWith({
        venueId: Number(mockAlgoliaVenue.objectID),
        searchId,
        from: 'searchVenuePlaylist',
      })
    })
  })

  it('should render a venue type tile icon when banner_url is not provided', () => {
    render(<SearchVenueItem venue={mockAlgoliaVenue} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.getByTestId('venue-type-tile')).toBeOnTheScreen()
  })

  it('should render a banner image when banner_url is provided', () => {
    const venueWithBanner = {
      ...mockAlgoliaVenue,
      banner_url:
        'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_magic_the_gathering_arena_01_1920x1080.jpg',
    }
    render(<SearchVenueItem venue={venueWithBanner} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.getByTestId('tileImage')).toBeOnTheScreen()
  })

  it('should navigate to the venue when pressing a search venue item', async () => {
    render(
      <SearchVenueItem
        venue={mockAlgoliaVenue}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        searchId="testUuidV4"
      />
    )

    fireEvent.press(screen.getByTestId(/Lieu/))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Venue', {
        id: Number(mockAlgoliaVenue.objectID),
        from: 'venue',
        searchId: 'testUuidV4',
      })
    })
  })

  it('should display the distance tag when distance is available', () => {
    mockDistance = '10 km'
    render(<SearchVenueItem venue={mockAlgoliaVenue} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.getByText('à 10 km')).toBeOnTheScreen()
  })

  it('should not display the distance tag when distance is not available', () => {
    mockDistance = null
    render(<SearchVenueItem venue={mockAlgoliaVenue} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.queryByText('à 10 km')).not.toBeOnTheScreen()
  })

  it('should display only the city when postal code is null', () => {
    render(
      <SearchVenueItem
        venue={{ ...mockAlgoliaVenue, postalCode: null }}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
      />
    )

    expect(screen.getByText(mockAlgoliaVenue.city)).toBeOnTheScreen()
  })

  it('should display only the city when postal code is an empty string', () => {
    render(
      <SearchVenueItem
        venue={{ ...mockAlgoliaVenue, postalCode: '' }}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
      />
    )

    expect(screen.getByText(mockAlgoliaVenue.city)).toBeOnTheScreen()
  })
})
