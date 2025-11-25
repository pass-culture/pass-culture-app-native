import mockdate from 'mockdate'
import React, { ComponentProps } from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OfferResponseV2, SubcategoryIdEnum } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferPlace, OfferPlaceProps } from 'features/offer/components/OfferPlace/OfferPlace'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import * as fetchAlgoliaOffer from 'libs/algolia/fetchAlgolia/fetchOffers'
import { analytics } from 'libs/analytics/provider'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import * as useModalAPI from 'ui/components/modals/useModal'

const offerVenues = [
  {
    title: 'Envie de lire',
    address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
    distance: '500 m',
    offerId: 1,
    price: 1000,
  },
  {
    title: 'Le Livre Éclaire',
    address: '75013 Paris, 56 rue de Tolbiac',
    distance: '1,5 km',
    offerId: 2,
    price: 1000,
  },
  {
    title: 'Hachette Livre',
    address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
    distance: '2,4 km',
    offerId: 3,
    price: 1000,
  },
]

const baseValueSearchVenueOffer = {
  hasNextPage: true,
  fetchNextPage: jest.fn(),
  data: {
    pages: [
      {
        nbHits: 0,
        hits: [],
        page: 0,
      },
    ],
  },
  isFetching: false,
}
const searchVenueOfferEmpty = {
  ...baseValueSearchVenueOffer,
  venueList: [],
  nbVenueItems: 0,
}
const searchVenueOfferWithVenues = {
  ...baseValueSearchVenueOffer,
  venueList: offerVenues,
  nbVenueItems: 2,
}
const mockUseSearchVenueOffers = jest.fn(() => searchVenueOfferWithVenues)
jest.mock('queries/searchVenuesOffer/useSearchVenueOffersInfiniteQuery', () => ({
  useSearchVenueOffersInfiniteQuery: () => mockUseSearchVenueOffers(),
}))

const offerPlaceProps: OfferPlaceProps = {
  offer: mockOffer,
  subcategory: mockSubcategory,
  isOfferAtSameAddressAsVenue: true,
}

const DEFAULT_USER_LOCATION = { latitude: 5, longitude: -52 }

const EVERYWHERE_USER_POSITION = {
  userLocation: null,
  selectedPlace: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  geolocPosition: undefined,
  place: null,
}
const AROUND_ME_POSITION = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: null,
  selectedLocationMode: LocationMode.AROUND_ME,
  geolocPosition: DEFAULT_USER_LOCATION,
  place: null,
}

const mockUseLocation = jest.fn((): Partial<ILocationContext> => EVERYWHERE_USER_POSITION)
jest.mock('libs/location/location', () => ({
  useLocation: () => mockUseLocation(),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const fetchOffersSpy = jest.spyOn(fetchAlgoliaOffer, 'fetchOffers')
fetchOffersSpy.mockResolvedValue({} as fetchAlgoliaOffer.FetchOffersResponse)

const user = userEvent.setup()
jest.useFakeTimers()

describe('<OfferPlace />', () => {
  beforeEach(() => {
    mockdate.set(new Date('2021-01-01'))
    mockUseSearchVenueOffers.mockReturnValue(searchVenueOfferWithVenues)
  })

  it('should display change venue button when offer subcategory is "Livres audio", offer has an EAN and that there are other venues offering the same offer', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.getByText('Changer le lieu de retrait')).toBeOnTheScreen()
  })

  it('should display new xp cine block when offer subcategory is "Seance cine"', async () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        extraData: { allocineId: 2765410054 },
      },
    })

    await screen.findByText('Trouve ta séance')

    expect(screen.getByTestId('offer-new-xp-cine-block')).toBeOnTheScreen()
  })

  it('should display "Trouve ta séance" above Venue when offer subcategory is "Seance cine"', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        extraData: { allocineId: 2765410054 },
      },
    })

    expect(screen.getByText('Trouve ta séance')).toBeOnTheScreen()
  })

  it('should not display "Trouve ta séance" above Venue when offer subcategory is not "Seance cine"', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.queryByText('Trouve ta séance')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Seance cine", offer has not an allocineId', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        extraData: { allocineId: undefined },
      },
    })

    expect(screen.queryByText('Changer de cinéma')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Livres audio", offer has an EAN and that there are not other venues offering the same offer', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Livres audio" and offer has not an EAN', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should display change venue button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.getByText('Changer le lieu de retrait')).toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)

    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is "Livres papier" and offer has not an EAN', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
    })

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should not display change venue button when offer subcategory is not "Livres papier" or "Livres audio"', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace(offerPlaceProps)

    expect(screen.queryByText('Changer le lieu de retrait')).not.toBeOnTheScreen()
  })

  it('should display venue block With "Lieu de l’évènement" in title', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace({
      offer: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
    })

    expect(screen.getByText('Lieu de l’évènement')).toBeOnTheScreen()
  })

  it('should navigate to an other offer when user choose an other venue from "Changer le lieu de retrait" button', async () => {
    const mockShowModal = jest.fn()
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: true,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })

    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '2765410054' },
      },
    })

    await user.press(screen.getByText('Le Livre Éclaire'))
    await user.press(screen.getByText('Choisir ce lieu'))

    expect(navigate).toHaveBeenCalledWith('Offer', {
      fromOfferId: mockOffer.id,
      id: 2,
      fromMultivenueOfferId: mockOffer.id,
    })
  })

  it('should log ConsultOffer when new offer venue is selected', async () => {
    const mockShowModal = jest.fn()
    jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
      visible: true,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })

    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: { ean: '2765410054' },
      },
    })

    await user.press(screen.getByText('Le Livre Éclaire'))
    await user.press(screen.getByText('Choisir ce lieu'))

    expect(analytics.logConsultOffer).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultOffer).toHaveBeenCalledWith({
      from: 'offer',
      fromMultivenueOfferId: '146112',
      offerId: '2',
      isHeadline: false,
    })
  })

  it('should log when the users press "Changer le lieu de retrait" button', async () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        extraData: {
          ean: '2765410054',
        },
      },
    })

    await user.press(screen.getByText('Changer le lieu de retrait'))

    expect(analytics.logMultivenueOptionDisplayed).toHaveBeenCalledWith(mockOffer.id)
  })

  it('should display venue tag distance when user share his position', () => {
    mockUseLocation
      .mockReturnValueOnce(AROUND_ME_POSITION)
      .mockReturnValueOnce(AROUND_ME_POSITION)
      .mockReturnValueOnce(AROUND_ME_POSITION)
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace({ distance: '73 km' })

    expect(screen.getByText('à 73 km')).toBeOnTheScreen()
  })

  it('should not display venue tag distance when user not share his position', () => {
    mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
    renderOfferPlace({})

    expect(screen.queryByText('à 73 km')).not.toBeOnTheScreen()
  })

  describe('Venue is permanent', () => {
    const offer: OfferResponseV2 = {
      ...mockOffer,
      venue: {
        ...mockOffer.venue,
        isPermanent: true,
      },
      address: {
        street: 'RUE DE CALI',
        city: 'Kourou',
        timezone: 'Europe/Paris',
        label: 'Cinéma de la fin',
        postalCode: '97310',
        coordinates: {
          latitude: 5.15839,
          longitude: -52.63741,
        },
      },
    }

    it('should not display "Voir la page du lieu" button when venue is not permanent', () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      const offer: OfferResponseV2 = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          isPermanent: false,
        },
        address: undefined,
      }
      renderOfferPlace({ offer })

      expect(screen.queryByText('Voir la page du lieu')).not.toBeOnTheScreen()
    })

    it('should navigate to venue page when pressing venue button', async () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      renderOfferPlace({ offer })

      await user.press(screen.getByTestId('RightFilled'))

      expect(navigate).toHaveBeenCalledWith('Venue', { id: mockOffer.venue.id })
    })

    it('should log ConsultVenue when pressing venue button', async () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      renderOfferPlace({ offer })

      await user.press(screen.getByTestId('RightFilled'))

      expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
        venueId: mockOffer.venue.id.toString(),
        from: 'offer',
      })
    })
  })

  describe('"Voir l’itinéraire" button', () => {
    it('should display "Voir l’itinéraire" button when complete venue address specified', () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      const offer: OfferResponseV2 = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          address: 'RUE DE CALI',
          city: 'Kourou',
          postalCode: '97310',
        },
      }

      renderOfferPlace({ offer })

      expect(screen.getByText('Voir l’itinéraire')).toBeOnTheScreen()
    })

    it('should log consult itinerary when pressing "Voir l’itinéraire" button', async () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      const offer: OfferResponseV2 = {
        ...mockOffer,
        id: 146112,
      }
      renderOfferPlace({ offer })

      await user.press(screen.getByText('Voir l’itinéraire'))

      expect(analytics.logConsultItinerary).toHaveBeenNthCalledWith(1, {
        from: 'offer',
        offerId: 146112,
      })
    })

    it('should not display "Voir l’itinéraire" button when venue address, city and postal code not provided', () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      const offer: OfferResponseV2 = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          address: undefined,
          city: undefined,
          postalCode: undefined,
        },
        address: undefined,
      }

      renderOfferPlace({ offer })

      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('should not display "Voir l’itinéraire" button when only venue address provided', () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      const offer: OfferResponseV2 = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          address: 'RUE DE CALI',
          city: undefined,
          postalCode: undefined,
        },
      }

      renderOfferPlace({ offer })

      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('should not display "Voir l’itinéraire" button when only venue city provided', () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      const offer: OfferResponseV2 = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          address: undefined,
          city: 'Kourou',
          postalCode: undefined,
        },
      }

      renderOfferPlace({ offer })

      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })

    it('should not display "Voir l’itinéraire" button when only venue city postalCode', () => {
      mockUseSearchVenueOffers.mockReturnValueOnce(searchVenueOfferEmpty)
      const offer: OfferResponseV2 = {
        ...mockOffer,
        venue: {
          ...mockOffer.venue,
          address: undefined,
          city: undefined,
          postalCode: '97310',
        },
      }

      renderOfferPlace({ offer })

      expect(screen.queryByText('Voir l’itinéraire')).not.toBeOnTheScreen()
    })
  })

  describe('HeaderMessage', () => {
    it.each`
      locationMode                 | place                                                                                             | headerMessage
      ${LocationMode.AROUND_ME}    | ${null}                                                                                           | ${'Lieux disponibles autour de moi'}
      ${LocationMode.EVERYWHERE}   | ${null}                                                                                           | ${'Lieux à proximité de “Cinéma de la fin”'}
      ${LocationMode.AROUND_PLACE} | ${{ label: 'Kourou', info: 'Guyane', geolocation: { longitude: -52.669736, latitude: 5.16186 } }} | ${'Lieux à proximité de “Kourou”'}
    `(
      'should return "$headerMessage" when location mode is $locationMode and place is $place',
      async ({
        locationMode,
        place,
        headerMessage,
      }: {
        locationMode: LocationMode
        place: SuggestedPlace | null
        headerMessage: string
      }) => {
        mockUseLocation
          .mockReturnValueOnce({
            selectedLocationMode: locationMode,
            place,
          })
          .mockReturnValueOnce({
            selectedLocationMode: locationMode,
            place,
          })
          .mockReturnValueOnce({
            selectedLocationMode: locationMode,
            place,
          })
          .mockReturnValueOnce({
            selectedLocationMode: locationMode,
            place,
          })

        renderOfferPlace({
          subcategory: mockSubcategory,
          offer: {
            ...mockOffer,
            subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
            extraData: {
              ean: '2765410054',
            },
          },
        })

        await act(async () => {
          await user.press(screen.getByText('Changer le lieu de retrait'))
        })

        expect(screen.getByText(headerMessage)).toBeOnTheScreen()
      }
    )
  })

  it('should display container with divider on mobile', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.getByTestId('place-container-with-divider')).toBeOnTheScreen()
  })

  it('should not display container with divider on desktop', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
      isDesktopViewport: true,
    })

    expect(screen.queryByTestId('place-container-with-divider')).not.toBeOnTheScreen()
  })

  it('should display container without divider on desktop', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
      isDesktopViewport: true,
    })

    expect(screen.getByTestId('place-container-without-divider')).toBeOnTheScreen()
  })

  it('should not display container without divider on mobile', () => {
    renderOfferPlace({
      ...offerPlaceProps,
      offer: {
        ...mockOffer,
        subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
        extraData: { ean: '2765410054' },
      },
    })

    expect(screen.queryByTestId('place-container-without-divider')).not.toBeOnTheScreen()
  })
})

type RenderOfferPlaceType = Partial<ComponentProps<typeof OfferPlace>> & {
  isDesktopViewport?: boolean
}

const renderOfferPlace = ({
  offer = mockOffer,
  subcategory = mockSubcategory,
  isDesktopViewport,
  distance,
}: RenderOfferPlaceType) =>
  render(
    reactQueryProviderHOC(
      <OfferCTAProvider>
        <OfferPlace
          offer={offer}
          subcategory={subcategory}
          distance={distance}
          isOfferAtSameAddressAsVenue
        />
      </OfferCTAProvider>
    ),
    {
      theme: { isDesktopViewport: isDesktopViewport ?? false },
      wrapper: AnchorProvider,
    }
  )
