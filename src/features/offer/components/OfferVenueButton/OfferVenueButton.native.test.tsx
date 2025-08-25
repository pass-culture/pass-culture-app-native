import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferVenueResponse } from 'api/gen'
import { OfferVenueButton } from 'features/offer/components/OfferVenueButton/OfferVenueButton'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()

jest.useFakeTimers()

describe('<OfferVenueButton />', () => {
  it('should display subtitle when city informed', () => {
    render(<OfferVenueButton venue={offerResponseSnap.venue} />)

    expect(screen.getByText('PARIS 8')).toBeOnTheScreen()
  })

  it('should not display subtitle when city not informed', () => {
    const venue: OfferVenueResponse = {
      ...offerResponseSnap.venue,
      city: undefined,
    }
    render(<OfferVenueButton venue={venue} />)

    expect(screen.queryByTestId('subtitle')).not.toBeOnTheScreen()
  })

  it('should redirect to venue page when pressing button', async () => {
    render(<OfferVenueButton venue={offerResponseSnap.venue} />)

    await user.press(screen.getByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE'))

    expect(navigate).toHaveBeenCalledWith('Venue', { id: offerResponseSnap.venue.id })
  })

  it('should track the venue redirection when the pressing button', async () => {
    render(<OfferVenueButton venue={offerResponseSnap.venue} />)

    await user.press(screen.getByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE'))

    expect(analytics.logConsultVenue).toHaveBeenCalledWith({
      venueId: offerResponseSnap.venue.id.toString(),
      from: 'offer',
    })
  })
})
