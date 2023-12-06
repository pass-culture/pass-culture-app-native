import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { fireEvent, render, screen } from 'tests/utils'

import { OfferVenueBlock } from './OfferVenueBlock'

// Mock useVenueBlock hook to avoid using Clipboard API
const mockOnCopyAddressPress = jest.fn()

jest.mock('features/offerv2/components/OfferVenueBlock/useVenueBlock', () => ({
  useVenueBlock: jest.fn(() => ({
    venueName: 'PATHE BEAUGRENELLE',
    address: '75008 PARIS 8, 2 RUE LAMENNAIS',
    onCopyAddressPress: mockOnCopyAddressPress,
  })),
}))

describe('<OfferVenueBlock />', () => {
  it('should display title', () => {
    render(
      <OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} distance="1,1 km" />
    )

    expect(screen.getByText('Lieu de retrait')).toBeOnTheScreen()
  })

  it('should render venue name', () => {
    render(<OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} />)

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should render address', () => {
    render(<OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} />)

    expect(screen.getByText('75008 PARIS 8, 2 RUE LAMENNAIS')).toBeOnTheScreen()
  })

  it('should render distance', () => {
    render(
      <OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} distance="1,1 km" />
    )

    expect(screen.getByText('à 1,1 km')).toBeOnTheScreen()
  })

  it('should not render distance when not informed', () => {
    render(<OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} />)

    expect(screen.queryByText('à 1,1 km')).not.toBeOnTheScreen()
  })

  it("should render 'Changer le lieu de retrait' button when onChangeVenuePress is defined", () => {
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        venue={offerResponseSnap.venue}
        onChangeVenuePress={() => {}}
      />
    )

    expect(screen.getByText('Changer le lieu de retrait')).toBeOnTheScreen()
  })

  it("should handle 'Changer le lieu de retrait' button press", () => {
    const onChangeVenuePress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        venue={offerResponseSnap.venue}
        onChangeVenuePress={onChangeVenuePress}
      />
    )

    fireEvent.press(screen.getByText('Changer le lieu de retrait'))

    expect(onChangeVenuePress).toHaveBeenCalledTimes(1)
  })

  it("should not render 'Changer le lieu de retrait' button when onChangeVenuePress is undefined", () => {
    render(<OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} />)

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should render copy address button', () => {
    render(<OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} />)

    expect(screen.getByText('Copier l’adresse')).toBeOnTheScreen()
  })

  it('should handle copy address button press', () => {
    render(<OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} />)

    fireEvent.press(screen.getByText('Copier l’adresse'))

    expect(mockOnCopyAddressPress).toHaveBeenCalledTimes(1)
  })

  it('should render see itinerary button', () => {
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        venue={offerResponseSnap.venue}
        onSeeItineraryPress={() => {}}
      />
    )

    expect(screen.getByText('Voir l’itinéraire')).toBeOnTheScreen()
  })

  it('should handle see itinerary button press', () => {
    const onSeeItineraryPress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        venue={offerResponseSnap.venue}
        onSeeItineraryPress={onSeeItineraryPress}
      />
    )

    fireEvent.press(screen.getByText('Voir l’itinéraire'))

    expect(onSeeItineraryPress).toHaveBeenCalledTimes(1)
  })

  it('should not render see itinerary button when onSeeItineraryPress is undefined', () => {
    render(<OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} />)

    expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
  })

  it('should render see venue button', () => {
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        venue={offerResponseSnap.venue}
        onSeeVenuePress={() => {}}
      />
    )

    expect(screen.getByText('Voir la page du lieu')).toBeOnTheScreen()
  })

  it('should handle see venue button press', () => {
    const onSeeVenuePress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        venue={offerResponseSnap.venue}
        onSeeVenuePress={onSeeVenuePress}
      />
    )

    fireEvent.press(screen.getByText('Voir la page du lieu'))

    expect(onSeeVenuePress).toHaveBeenCalledTimes(1)
  })

  it('should not render see venue button when onSeeVenuePress is undefined', () => {
    render(<OfferVenueBlock title="Lieu de retrait" venue={offerResponseSnap.venue} />)

    expect(screen.queryByText('Voir la page du lieu')).not.toBeOnTheScreen()
  })
})
