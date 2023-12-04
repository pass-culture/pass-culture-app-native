import React from 'react'
import { Linking } from 'react-native'
import Share, { Social } from 'react-native-share'

import { VenueMessagingApps } from 'features/venue/components/VenueMessagingApps/VenueMessagingApps'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

const mockShareSingle = jest.spyOn(Share, 'shareSingle')
const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false)

describe('<VenueMessagingApps />', () => {
  beforeEach(() => {
    mockServer.getApiV1(`/venue/${venueResponseSnap.id}`, venueResponseSnap)
  })

  it('should share on instagram', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    render(reactQueryProviderHOC(<VenueMessagingApps venue={venueResponseSnap} />))

    const instagramButton = await screen.findByText(`Envoyer sur Instagram`)

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

  it('should log analytics on share', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    render(reactQueryProviderHOC(<VenueMessagingApps venue={venueResponseSnap} />))

    const instagramButton = await screen.findByText(`Envoyer sur Instagram`)

    fireEvent.press(instagramButton)

    expect(analytics.logShare).toHaveBeenCalledWith({
      from: 'venue',
      social: Social.Instagram,
      type: 'Venue',
      venueId: 5543,
    })
  })
})
