import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

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

const navigateToItineraryMock = jest.fn()
const useItinerary = () => ({
  navigateTo: navigateToItineraryMock,
})
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary,
}))

const cinemaOffer = { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.SEANCE_CINE }

describe('<OfferVenueBlock />', () => {
  it('should display title', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} distance="1,1 km" />)

    expect(screen.getByText('Lieu de retrait')).toBeOnTheScreen()
  })

  it('should render venue name', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should render address', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.getByText('75008 PARIS 8, 2 RUE LAMENNAIS')).toBeOnTheScreen()
  })

  it('should render distance', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} distance="1,1 km" />)

    expect(screen.getByText('à 1,1 km')).toBeOnTheScreen()
  })

  it('should not render distance when not informed', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.queryByText('à 1,1 km')).not.toBeOnTheScreen()
  })

  it("should render placeholder instead of thumbnail when venue doesn't have any image", () => {
    const offerWithNoImageVenue = {
      ...offerResponseSnap,
      venue: { ...offerResponseSnap.venue, bannerUrl: undefined },
    }
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerWithNoImageVenue} />)

    expect(screen.getByTestId('OfferVenueBlockPlaceholder')).toBeOnTheScreen()
  })

  it('should not render placeholder instead of thumbnail when venue has an image', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.queryByTestId('OfferVenueBlockPlaceholder')).not.toBeOnTheScreen()
  })

  it("should render 'Changer le lieu de retrait' button when onChangeVenuePress is defined", () => {
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onChangeVenuePress={() => {}}
      />
    )

    expect(screen.getByText('Changer le lieu de retrait')).toBeOnTheScreen()
  })

  it("should render 'Changer de cinéma' button when venue is a cinema and onChangeVenuePress is defined", () => {
    render(
      <OfferVenueBlock title="Lieu de retrait" offer={cinemaOffer} onChangeVenuePress={() => {}} />
    )

    expect(screen.getByText('Changer de cinéma')).toBeOnTheScreen()
  })

  it("should handle 'Changer le lieu de retrait' button press", () => {
    const onChangeVenuePress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onChangeVenuePress={onChangeVenuePress}
      />
    )

    fireEvent.press(screen.getByText('Changer le lieu de retrait'))

    expect(onChangeVenuePress).toHaveBeenCalledTimes(1)
  })

  it("should not render 'Changer le lieu de retrait' button when onChangeVenuePress is undefined", () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should render copy address button', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.getByText('Copier l’adresse')).toBeOnTheScreen()
  })

  it('should not render copy address button when offer is cinema', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={cinemaOffer} />)

    expect(screen.queryByText('Copier l’adresse')).not.toBeOnTheScreen()
  })

  it('should handle copy address button press', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    fireEvent.press(screen.getByText('Copier l’adresse'))

    expect(mockOnCopyAddressPress).toHaveBeenCalledTimes(1)
  })

  it('should render see itinerary button', () => {
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onSeeItineraryPress={jest.fn()}
      />
    )

    expect(screen.getByText('Voir l’itinéraire')).toBeOnTheScreen()
  })

  it('should handle see itinerary button press', () => {
    const onSeeItineraryPress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onSeeItineraryPress={onSeeItineraryPress}
      />
    )

    fireEvent.press(screen.getByText('Voir l’itinéraire'))

    expect(onSeeItineraryPress).toHaveBeenCalledTimes(1)
  })

  it('should not render see itinerary button when onSeeItineraryPress is undefined', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
  })

  it('should not render see itinerary button when offer is cinema', () => {
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={cinemaOffer}
        onSeeItineraryPress={jest.fn()}
      />
    )

    expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
  })

  it('should display right icon when venue is permanent', () => {
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onSeeVenuePress={jest.fn()}
      />
    )

    expect(screen.getByTestId('RightFilled')).toBeOnTheScreen()
  })

  it('should handle see venue button press', () => {
    const onSeeVenuePress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onSeeVenuePress={onSeeVenuePress}
      />
    )

    fireEvent.press(screen.getByText(offerResponseSnap.venue.name))

    expect(onSeeVenuePress).toHaveBeenCalledTimes(1)
  })

  it('should not render see venue button when onSeeVenuePress is undefined', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.queryByTestId('RightFilled')).not.toBeOnTheScreen()
  })

  it('should redirect to Google Maps itinerary when pressing "Voir l’itinéraire" button', async () => {
    const onSeeItineraryPress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onSeeItineraryPress={onSeeItineraryPress}
      />
    )

    fireEvent.press(screen.getByText('Voir l’itinéraire'))

    await waitFor(() => {
      expect(navigateToItineraryMock).toHaveBeenNthCalledWith(1, '75008 PARIS 8, 2 RUE LAMENNAIS')
    })
  })
})
