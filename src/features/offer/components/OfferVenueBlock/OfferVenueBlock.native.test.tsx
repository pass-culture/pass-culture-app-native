import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { ILocationContext } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { mockSettings } from 'tests/mockSettings'
import { userEvent, render, screen } from 'tests/utils'

import { OfferVenueBlock } from './OfferVenueBlock'

mockSettings()
jest.mock('features/offer/components/OfferVenueBlock/useVenueBlock')
const mockOnCopyAddressPress = jest.fn()
const mockUseVenueBlock = jest.mocked(useVenueBlock)

const mockNavigateToItinerary = jest.fn()
const mockUseItinerary = () => ({
  navigateTo: mockNavigateToItinerary,
})
jest.mock('libs/itinerary/useItinerary', () => ({
  useItinerary: jest.fn(() => mockUseItinerary()),
}))

const cinemaOffer = { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.SEANCE_CINE }

const DEFAULT_USER_LOCATION = { latitude: 20, longitude: 3 }

const EVERYWHERE_USER_POSITION = {
  userLocation: null,
  selectedPlace: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  geolocPosition: undefined,
}
const AROUND_ME_POSITION = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: null,
  selectedLocationMode: LocationMode.AROUND_ME,
  geolocPosition: DEFAULT_USER_LOCATION,
}

const mockUseLocation = jest.fn((): Partial<ILocationContext> => EVERYWHERE_USER_POSITION)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<OfferVenueBlock />', () => {
  mockUseVenueBlock.mockReturnValue({
    venueName: 'PATHE BEAUGRENELLE',
    venueAddress: '75008 PARIS 8, 2 RUE LAMENNAIS',
    isOfferAddressDifferent: false,
    onCopyAddressPress: mockOnCopyAddressPress,
  })

  it('should display title', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

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

  it('should render distance when user chose geolocation', () => {
    mockUseLocation.mockReturnValueOnce(AROUND_ME_POSITION)

    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.getByText('à 105 km')).toBeOnTheScreen()
  })

  it("should not render distance when user chose 'France entière'", () => {
    mockUseLocation.mockReturnValueOnce(EVERYWHERE_USER_POSITION)

    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.queryByText('à 105 km')).not.toBeOnTheScreen()
  })

  it("should render placeholder instead of thumbnail when venue doesn't have any image", () => {
    const offerWithNoImageVenue = {
      ...offerResponseSnap,
      venue: { ...offerResponseSnap.venue, bannerUrl: undefined },
    }
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerWithNoImageVenue} />)

    expect(screen.getByTestId('VenuePreviewPlaceholder')).toBeOnTheScreen()
  })

  it('should not render placeholder instead of thumbnail when venue has an image', () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    expect(screen.queryByTestId('VenuePreviewPlaceholder')).not.toBeOnTheScreen()
  })

  it("should render 'Changer le lieu de retrait' button when onChangeVenuePress is defined", () => {
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onChangeVenuePress={jest.fn()}
      />
    )

    expect(screen.getByText('Changer le lieu de retrait')).toBeOnTheScreen()
  })

  it("should render 'Changer de cinéma' button when venue is a cinema and onChangeVenuePress is defined", () => {
    render(
      <OfferVenueBlock title="Lieu de retrait" offer={cinemaOffer} onChangeVenuePress={jest.fn()} />
    )

    expect(screen.getByText('Changer de cinéma')).toBeOnTheScreen()
  })

  it("should handle 'Changer le lieu de retrait' button press", async () => {
    const onChangeVenuePress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onChangeVenuePress={onChangeVenuePress}
      />
    )

    await user.press(screen.getByText('Changer le lieu de retrait'))

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

  it('should handle copy address button press', async () => {
    render(<OfferVenueBlock title="Lieu de retrait" offer={offerResponseSnap} />)

    await user.press(screen.getByText('Copier l’adresse'))

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

  it('should handle see itinerary button press', async () => {
    const onSeeItineraryPress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onSeeItineraryPress={onSeeItineraryPress}
      />
    )

    await user.press(screen.getByText('Voir l’itinéraire'))

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

  it('should not display right icon when venue is permanent but offer address is different than venue address', () => {
    // useVenue hook is called twice, the second call is the one we want to mock for the test
    mockUseVenueBlock
      .mockReturnValueOnce({
        venueName: 'PATHE BEAUGRENELLE',
        venueAddress: '75008 PARIS 8, 2 RUE LAMENNAIS',
        isOfferAddressDifferent: false,
        onCopyAddressPress: mockOnCopyAddressPress,
      })
      .mockReturnValueOnce({
        venueName: 'PATHE BEAUGRENELLE',
        venueAddress: '75008 PARIS 8, 2 RUE LAMENNAIS',
        isOfferAddressDifferent: true,
        onCopyAddressPress: mockOnCopyAddressPress,
      })

    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onSeeVenuePress={jest.fn()}
      />
    )

    expect(screen.queryByTestId('RightFilled')).not.toBeOnTheScreen()
  })

  it('should handle see venue button press', async () => {
    const onSeeVenuePress = jest.fn()
    render(
      <OfferVenueBlock
        title="Lieu de retrait"
        offer={offerResponseSnap}
        onSeeVenuePress={onSeeVenuePress}
      />
    )

    await user.press(screen.getByText(offerResponseSnap.venue.name))

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

    await user.press(screen.getByText('Voir l’itinéraire'))

    expect(mockNavigateToItinerary).toHaveBeenNthCalledWith(1, '75008 PARIS 8, 2 RUE LAMENNAIS')
  })
})
