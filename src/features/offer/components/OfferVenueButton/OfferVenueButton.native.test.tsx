import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferVenueResponse } from 'api/gen'
import { OfferVenueButton } from 'features/offer/components/OfferVenueButton/OfferVenueButton'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics/provider'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

describe('<OfferVenueButton />', () => {
  it('should display public name when informed', () => {
    const venue: OfferVenueResponse = {
      ...offerResponseSnap.venue,
      publicName: 'PATHE GAUMONT BEAUGRENELLE',
    }
    render(<OfferVenueButton venue={venue} />)

    expect(screen.getByText('PATHE GAUMONT BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should not display name when public name informed', () => {
    const venue: OfferVenueResponse = {
      ...offerResponseSnap.venue,
      publicName: 'PATHE GAUMONT BEAUGRENELLE',
    }
    render(<OfferVenueButton venue={venue} />)

    expect(screen.queryByText('PATHE BEAUGRENELLE')).not.toBeOnTheScreen()
  })

  it('should display name when public name not informed', () => {
    render(<OfferVenueButton venue={offerResponseSnap.venue} />)

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should display name when public name is empty', () => {
    const venue: OfferVenueResponse = {
      ...offerResponseSnap.venue,
      publicName: '',
    }
    render(<OfferVenueButton venue={venue} />)

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

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

    fireEvent.press(screen.getByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE'))

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('Venue', { id: offerResponseSnap.venue.id })
    )
  })

  it('should track the venue redirection when the pressing button', () => {
    render(<OfferVenueButton venue={offerResponseSnap.venue} />)

    fireEvent.press(screen.getByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE'))

    expect(analytics.logConsultVenue).toHaveBeenCalledWith({
      venueId: offerResponseSnap.venue.id,
      from: 'offer',
    })
  })
})
