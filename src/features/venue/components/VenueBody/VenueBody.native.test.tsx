import Clipboard from '@react-native-clipboard/clipboard'
import mockdate from 'mockdate'
import React from 'react'
import { Linking } from 'react-native'
import Share, { Social } from 'react-native-share'
import { UseQueryResult } from 'react-query'

import { useRoute } from '__mocks__/@react-navigation/native'
import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { gtlPlaylistAlgoliaSnapshot } from 'features/gtlPlaylist/fixtures/gtlPlaylistAlgoliaSnapshot'
import * as useGTLPlaylists from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import * as useVenueOffers from 'features/venue/api/useVenueOffers'
import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { ILocationContext, useLocation } from 'libs/location'
import { Network } from 'libs/share/types'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')
jest.mock('@react-native-clipboard/clipboard')
const mockShareSingle = jest.spyOn(Share, 'shareSingle')
const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false)
jest
  .spyOn(useGTLPlaylists, 'useGTLPlaylists')
  .mockReturnValue({ isLoading: false, gtlPlaylists: gtlPlaylistAlgoliaSnapshot })
jest.spyOn(useVenueOffers, 'useVenueOffers').mockReturnValue({
  isLoading: false,
  data: { hits: VenueOffersResponseSnap, nbHits: 10 },
} as UseQueryResult<{ hits: Offer[]; nbHits: number }, unknown>)

jest.mock('libs/location')
const mockUseLocation = jest.mocked(useLocation)

const mockSubcategories = placeholderData.subcategories
const mockHomepageLabels = placeholderData.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      homepageLabels: mockHomepageLabels,
    },
  }),
}))

const venueId = venueResponseSnap.id
useRoute.mockImplementation(() => ({ params: { id: venueId } }))

describe('<VenueBody />', () => {
  beforeEach(() => {
    // We mock only the first call to canOpenURL so we can wait for instagram to be displayed
    // This way we avoid act warning when the calls to openURL are made
    canOpenURLSpy.mockResolvedValueOnce(true)
  })

  it('should display full venue address', async () => {
    render(<VenueBody venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    expect(screen.getByText('1 boulevard Poissonnière, 75000 Paris')).toBeOnTheScreen()
  })

  it('should display venue type', async () => {
    const culturalCenterVenue: VenueResponse = {
      ...venueResponseSnap,
      venueTypeCode: VenueTypeCodeKey.CULTURAL_CENTRE,
    }

    render(<VenueBody venue={culturalCenterVenue} onScroll={jest.fn()} />)
    await waitUntilRendered()

    expect(screen.getByText('Centres culturels')).toBeOnTheScreen()
  })

  it('should display distance between user and venue when geolocation is activated', async () => {
    const userLocation = { latitude: 30, longitude: 30.1 }
    mockUseLocation.mockReturnValueOnce({
      userLocation,
      hasGeolocPosition: true,
    } as ILocationContext)
    const locatedVenue: VenueResponse = { ...venueResponseSnap, latitude: 30, longitude: 30 }

    render(<VenueBody venue={locatedVenue} onScroll={jest.fn()} />)
    await waitUntilRendered()

    expect(screen.getByText('À 10 km')).toBeOnTheScreen()
  })

  it('should not display distance between user and venue when geolocation is not activated', async () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
    } as ILocationContext)
    const locatedVenue: VenueResponse = { ...venueResponseSnap, latitude: 30, longitude: 30 }

    render(<VenueBody venue={locatedVenue} onScroll={jest.fn()} />)
    await waitUntilRendered()

    expect(screen.queryByText('À 10 km')).not.toBeOnTheScreen()
  })

  it('should copy the whole address when pressing the copy button', async () => {
    render(<VenueBody venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    fireEvent.press(screen.getByText('Copier l’adresse'))

    expect(Clipboard.setString).toHaveBeenCalledWith(
      'Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris'
    )
  })

  it('should log analytics when copying address', async () => {
    Clipboard.getString = jest
      .fn()
      .mockReturnValue('Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris')
    render(<VenueBody venue={venueResponseSnap} onScroll={jest.fn()} />)

    fireEvent.press(screen.getByText('Copier l’adresse'))

    await waitFor(() => {
      expect(analytics.logCopyAddress).toHaveBeenCalledWith({
        venueId: venueResponseSnap.id,
        from: 'venue',
      })
    })
  })

  it('should log analytics when pressing Voir l’itinéraire', async () => {
    render(<VenueBody venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    fireEvent.press(screen.getByText('Voir l’itinéraire'))

    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({
      venueId: venueResponseSnap.id,
      from: 'venue',
    })
  })

  it('should display default background image when no banner for venue', async () => {
    render(<VenueBody venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    expect(screen.getByTestId('defaultVenueBackground')).toBeOnTheScreen()
  })

  it('should display withdrawal details', async () => {
    render(<VenueBody venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(screen.getByText('How to withdraw, https://test.com')).toBeOnTheScreen()
  })

  it('should share on Instagram', async () => {
    render(<VenueBody venue={venueResponseSnap} onScroll={jest.fn()} />)

    const instagramButton = await screen.findByText(`Envoyer sur ${[Network.instagram]}`)

    fireEvent.press(instagramButton)

    expect(mockShareSingle).toHaveBeenCalledWith({
      social: Social.Instagram,
      message: encodeURIComponent(
        `Retrouve "${venueResponseSnap.name}" sur le pass Culture\u00a0:\nhttps://webapp-v2.example.com/lieu/5543?utm_gen=product&utm_campaign=share_venue&utm_medium=social_media&utm_source=Instagram`
      ),
      type: 'text',
      url: undefined,
    })
  })

  it('should log event when pressing on Infos pratiques tab', async () => {
    render(<VenueBody venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(analytics.logConsultPracticalInformations).toHaveBeenCalledWith({
      venueId: venueResponseSnap.id,
    })
  })

  it('should log event when pressing on Offres disponibles tab', async () => {
    render(<VenueBody venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    fireEvent.press(screen.getByText('Offres disponibles'))

    expect(analytics.logConsultVenueOffers).toHaveBeenCalledWith({ venueId: venueResponseSnap.id })
  })
})

const waitUntilRendered = async () => {
  // We wait until the full render is done
  // This is due to asynchronous calls to check the media on the phone
  await screen.findByText(`Envoyer sur ${[Network.instagram]}`)
}
