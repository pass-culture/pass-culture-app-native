import Clipboard from '@react-native-clipboard/clipboard'
import mockdate from 'mockdate'
import React from 'react'
import { Linking } from 'react-native'
import Share, { Social } from 'react-native-share'

import { useRoute } from '__mocks__/@react-navigation/native'
import { VenueBodyNew } from 'features/venue/components/VenueBodyNew/VenueBodyNew'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')
jest.mock('@react-native-clipboard/clipboard')
const mockShareSingle = jest.spyOn(Share, 'shareSingle')
const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false)

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
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    expect(screen.getByText('1 boulevard Poissonnière, 75000 Paris')).toBeOnTheScreen()
  })

  it('should copy the whole address when pressing the copy button', async () => {
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)
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
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)

    fireEvent.press(screen.getByText('Copier l’adresse'))

    await waitFor(() => {
      expect(analytics.logCopyAddress).toHaveBeenCalledWith({
        venueId: venueResponseSnap.id,
        from: 'venue',
      })
    })
  })

  it('should display default background image when no banner for venue', async () => {
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    expect(screen.getByTestId('defaultVenueBackground')).toBeOnTheScreen()
  })

  it('should display withdrawal details', async () => {
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)
    await waitUntilRendered()

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(screen.getByText('How to withdraw, https://test.com')).toBeOnTheScreen()
  })

  it('should share on Instagram', async () => {
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)

    const instagramButton = await screen.findByText(`Envoyer sur ${[Network.instagram]}`)

    fireEvent.press(instagramButton)

    expect(mockShareSingle).toHaveBeenCalledWith({
      social: Social.Instagram,
      message: encodeURIComponent(
        `Retrouve "${venueResponseSnap.name}" sur le pass Culture\nhttps://webapp-v2.example.com/lieu/5543?utm_gen=product&utm_campaign=share_venue&utm_medium=social_media&utm_source=Instagram`
      ),
      type: 'text',
      url: undefined,
    })
  })
})

const waitUntilRendered = async () => {
  // We wait until the full render is done
  // This is due to asynchronous calls to check the media on the phone
  await screen.findByText(`Envoyer sur ${[Network.instagram]}`)
}
