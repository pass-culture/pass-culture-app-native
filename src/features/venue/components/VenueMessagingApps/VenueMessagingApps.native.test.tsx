import React from 'react'
import { Linking } from 'react-native'
import Share, { Social } from 'react-native-share'

import { VenueResponse } from 'api/gen'
import { VenueMessagingApps } from 'features/venue/components/VenueMessagingApps/VenueMessagingApps'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

const mockShareSingle = jest.spyOn(Share, 'shareSingle')
const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false)

jest.mock('libs/firebase/analytics/analytics')

describe('<VenueMessagingApps />', () => {
  beforeEach(() => {
    mockServer.getApi<VenueResponse>(`/v1/venue/${venueDataTest.id}`, venueDataTest)
  })

  it('should share on instagram', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    render(reactQueryProviderHOC(<VenueMessagingApps venue={venueDataTest} />))

    const instagramButton = await screen.findByText(`Envoyer sur Instagram`)

    fireEvent.press(instagramButton)

    expect(mockShareSingle).toHaveBeenCalledWith({
      social: Social.Instagram,
      message: encodeURIComponent(
        `Retrouve "${venueDataTest.name}" sur le pass Culture\u00a0:\nhttps://webapp-v2.example.com/lieu/5543?utm_gen=product&utm_campaign=share_venue&utm_medium=social_media&utm_source=Instagram`
      ),
      type: 'text',
      url: undefined,
    })
  })

  it('should log analytics on share', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    render(reactQueryProviderHOC(<VenueMessagingApps venue={venueDataTest} />))

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
