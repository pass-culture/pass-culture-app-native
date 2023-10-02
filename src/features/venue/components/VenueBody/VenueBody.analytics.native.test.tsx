import React from 'react'
import { Linking } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { VenueBody } from 'features/venue/components/VenueBody/VenueBody'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { act, fireEvent, render, screen } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

const venueId = venueResponseSnap.id
const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL')

jest.mock('react-query')

jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => ({
    availableApps: [],
    navigateTo: jest.fn(),
  })),
}))

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<VenueBody /> - Analytics', () => {
  const trigger = async (component: ReactTestInstance) => {
    await act(async () => {
      fireEvent.press(component)
      jest.runAllTimers()
    })
  }

  it('should log ConsultWithdrawalModalities once when opening accessibility modalities', async () => {
    renderVenueBody()

    await trigger(screen.getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledWith({ venueId })

    await trigger(screen.getByText('Accessibilité'))
    await trigger(screen.getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultWithdrawalModalities once when opening withdrawal modalities', async () => {
    renderVenueBody()

    await trigger(screen.getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledWith({ venueId })

    await trigger(screen.getByText('Modalités de retrait'))
    await trigger(screen.getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultLocationItinerary when opening itinerary', async () => {
    renderVenueBody()
    await act(async () => {
      fireEvent.press(screen.getByText('Voir l’itinéraire'))
    })
    expect(analytics.logConsultItinerary).toHaveBeenCalledWith({ venueId, from: 'venue' })
  })
})

it('should log when the user shares the offer on a certain medium', async () => {
  canOpenURLSpy.mockResolvedValueOnce(true)
  renderVenueBody()

  const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.instagram]}`)
  fireEvent.press(socialMediumButton)

  expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
    type: 'Venue',
    from: 'venue',
    venue_id: venueId,
    social: Network.instagram,
  })
})

function renderVenueBody() {
  return render(<VenueBody venueId={venueId} onScroll={jest.fn()} />)
}
