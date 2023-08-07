import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AlgoliaVenue } from 'libs/algolia'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { SearchVenueItem } from './SearchVenueItem'

let mockDistance: string | null = null
jest.mock('libs/geolocation/hooks/useDistance', () => ({
  useDistance: () => mockDistance,
}))

const mockAlgoliaVenue: AlgoliaVenue = {
  objectID: '5543',
  name: 'UGC cinéma',
  city: 'Paris',
  offerer_name: 'séance de cinéma chandra',
  venue_type: 'MOVIE',
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

const onPressMock = jest.fn()
const ITEM_HEIGHT = 96
const ITEM_WIDTH = 144

describe('<SearchVenueItem />', () => {
  it('should render venue item correctly', () => {
    render(<SearchVenueItem venue={mockAlgoliaVenue} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.getByText(mockAlgoliaVenue.name)).toBeTruthy()
    expect(screen.getByText(mockAlgoliaVenue.city)).toBeTruthy()
  })

  it('should render a venue type tile icon when banner_url is not provided', () => {
    render(<SearchVenueItem venue={mockAlgoliaVenue} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.getByTestId('venue-type-tile')).toBeTruthy()
  })

  it('should render a banner image when banner_url is provided', () => {
    const venueWithBanner = {
      ...mockAlgoliaVenue,
      banner_url:
        'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_magic_the_gathering_arena_01_1920x1080.jpg',
    }
    render(<SearchVenueItem venue={venueWithBanner} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.getByTestId('tileImage')).toBeTruthy()
  })

  it('should call onBeforeNavigate when the search venue item is pressed', () => {
    render(
      <SearchVenueItem
        venue={mockAlgoliaVenue}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        onPress={onPressMock}
      />
    )

    fireEvent.press(screen.getByTestId('Lieu UGC cinéma du type Autre type de lieu, '))

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('should navigate to the venue when pressing a search venue item', async () => {
    render(<SearchVenueItem venue={mockAlgoliaVenue} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    fireEvent.press(screen.getByTestId(/Lieu/))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Venue', { id: mockAlgoliaVenue.objectID })
    })
  })

  it('should display the distance tag when distance is available', () => {
    mockDistance = '10 km'
    render(<SearchVenueItem venue={mockAlgoliaVenue} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.getByText('à 10 km')).toBeTruthy()
  })

  it('should not display the distance tag when distance is not available', () => {
    mockDistance = null
    render(<SearchVenueItem venue={mockAlgoliaVenue} width={ITEM_WIDTH} height={ITEM_HEIGHT} />)

    expect(screen.queryByText('à 10 km')).toBeFalsy()
  })
})
