import * as reactNavigation from '@react-navigation/native'
import React, { ComponentProps } from 'react'

import {
  CategoryIdEnum,
  HomepageLabelNameEnumv2,
  NativeCategoryIdEnumv2,
  OfferResponseV2,
  OnlineOfflinePlatformChoicesEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnum,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { mockSubcategory, mockSubcategoryBook } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useArtistResults from 'features/offer/helpers/useArtistResults/useArtistResults'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place/types'
import { Subcategory } from 'libs/subcategories/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

let mockPosition: Position = { latitude: 90.4773245, longitude: 90.4773245 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockPosition,
    geolocPosition: mockPosition,
    place: Kourou,
  }),
}))

jest.mock('@react-navigation/native')
const mockNavigate = jest.fn()
jest.spyOn(reactNavigation, 'useNavigation').mockImplementation(() => ({
  navigate: mockNavigate,
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/components/anchor/AnchorContext', () => ({
  useScrollToAnchor: jest.fn,
  useRegisterAnchor: jest.fn,
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const useArtistResultsSpy = jest
  .spyOn(useArtistResults, 'useArtistResults')
  .mockImplementation()
  .mockReturnValue({
    artistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
    artistTopOffers: mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4),
  })

const user = userEvent.setup()

jest.useFakeTimers()

describe('<OfferBody />', () => {
  beforeEach(() => {
    mockPosition = { latitude: 90.4773245, longitude: 90.4773245 }
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_ARTIST_PAGE,
      RemoteStoreFeatureFlags.WIP_REACTION_FEATURE,
      RemoteStoreFeatureFlags.WIP_OFFER_CHRONICLE_SECTION,
    ])
  })

  describe('Tags section', () => {
    it('should display tags', async () => {
      renderOfferBody({})

      expect(await screen.findByText('Cinéma plein air')).toBeOnTheScreen()
    })

    it('should display vinyl tag', async () => {
      const offer: OfferResponseV2 = {
        ...offerResponseSnap,
        subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
        extraData: { musicType: 'Metal', musicSubType: 'Industrial' },
      }
      const subcategory: Subcategory = {
        id: SubcategoryIdEnumv2.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
        categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
        appLabel: 'Vinyles et autres supports',
        searchGroupName: SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
        homepageLabelName: HomepageLabelNameEnumv2.MUSIQUE,
        isEvent: false,
        onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnumv2.OFFLINE,
        nativeCategoryId: NativeCategoryIdEnumv2.VINYLES,
      }

      renderOfferBody({
        offer,
        subcategory,
      })

      expect(await screen.findByText('Metal')).toBeOnTheScreen()
      expect(screen.getByText('Industrial')).toBeOnTheScreen()
      expect(screen.getByText('Vinyles et autres supports')).toBeOnTheScreen()
    })
  })

  it('should display offer as a title', async () => {
    renderOfferBody({})

    expect(
      await screen.findByLabelText('Nom de l’offre\u00a0: Sous les étoiles de Paris - VF')
    ).toBeOnTheScreen()
  })

  it('should display artists', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      extraData: { stageDirector: 'Marion Cotillard, Leonardo DiCaprio' },
    }
    renderOfferBody({
      offer,
    })

    expect(await screen.findByText('Marion Cotillard, Leonardo DiCaprio')).toBeOnTheScreen()
  })

  it('should display prices', async () => {
    renderOfferBody({})

    expect(await screen.findByText('Dès 5,00 €')).toBeOnTheScreen()
  })

  it('should not display prices when the offer is free', async () => {
    const offerFree: OfferResponseV2 = {
      ...offerResponseSnap,
      stocks: [
        {
          id: 118929,
          beginningDatetime: '2021-01-04T13:30:00',
          price: 0,
          isBookable: true,
          isExpired: false,
          isForbiddenToUnderage: false,
          isSoldOut: false,
          features: [],
        },
      ],
    }

    renderOfferBody({ offer: offerFree })

    await screen.findByText(offerFree.name)

    expect(screen.queryByText('5,00 €')).not.toBeOnTheScreen()
  })

  describe('Venue button section & Summary info section', () => {
    it('should display both section when this is not a cinema offer', async () => {
      const subcategory: Subcategory = {
        ...mockSubcategory,
        categoryId: CategoryIdEnum.LIVRE,
      }
      renderOfferBody({ subcategory })

      expect(
        await screen.findByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')
      ).toBeOnTheScreen()
      expect(screen.getByText('Duo')).toBeOnTheScreen()
    })

    it('should not display both section', async () => {
      const offer: OfferResponseV2 = {
        ...offerResponseSnap,
        isDuo: false,
        venue: {
          ...offerResponseSnap.venue,
          isPermanent: false,
        },
      }

      renderOfferBody({ offer })

      await screen.findByText(offer.name)

      expect(
        screen.queryByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')
      ).not.toBeOnTheScreen()
      expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
    })

    it('should not display top separator between this two section', async () => {
      const offer: OfferResponseV2 = {
        ...offerResponseSnap,
        isDuo: false,
        venue: {
          ...offerResponseSnap.venue,
          isPermanent: false,
        },
      }
      renderOfferBody({ offer })

      await screen.findByText(offer.name)

      expect(screen.queryByTestId('topSeparator')).not.toBeOnTheScreen()
    })

    it('should display top separator above summary info list when venue button is not displayed', async () => {
      const offerWithoutPermanentVenue: OfferResponseV2 = {
        ...offerResponseSnap,
        venue: {
          ...offerResponseSnap.venue,
          isPermanent: false,
        },
      }
      renderOfferBody({ offer: offerWithoutPermanentVenue })

      expect(await screen.findByTestId('topSeparator')).toBeOnTheScreen()
    })

    it('should not display top separator when there are no summaryInfo items to display', async () => {
      renderOfferBody({})

      await screen.findByTestId('VenuePreviewImage')

      expect(screen.queryByTestId('topSeparator')).not.toBeOnTheScreen()
    })

    describe('Venue button section', () => {
      it('should display venue button when this is not a cinema offer', async () => {
        const subcategory: Subcategory = {
          ...mockSubcategory,
          categoryId: CategoryIdEnum.LIVRE,
        }
        renderOfferBody({ subcategory })

        expect(
          await screen.findByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')
        ).toBeOnTheScreen()
      })

      it('should not display venue button when venue is not permanent', async () => {
        const offer: OfferResponseV2 = {
          ...offerResponseSnap,
          venue: {
            ...offerResponseSnap.venue,
            isPermanent: false,
          },
        }
        renderOfferBody({ offer })

        await screen.findByText(offer.name)

        expect(
          screen.queryByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')
        ).not.toBeOnTheScreen()
      })

      it('should not display venue button when this is a cinema offer', async () => {
        const offer: OfferResponseV2 = {
          ...offerResponseSnap,
          venue: {
            ...offerResponseSnap.venue,
            isPermanent: true,
          },
        }
        renderOfferBody({ offer })

        await screen.findByText(offer.name)

        expect(
          screen.queryByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')
        ).not.toBeOnTheScreen()
      })
    })

    describe('Summary info section', () => {
      it('should display duo info', async () => {
        const offer: OfferResponseV2 = {
          ...offerResponseSnap,
          isDuo: true,
        }
        renderOfferBody({ offer })

        expect(await screen.findByText('Duo')).toBeOnTheScreen()
      })

      it('should not display duo info', async () => {
        const offer: OfferResponseV2 = {
          ...offerResponseSnap,
          isDuo: false,
        }
        renderOfferBody({ offer })

        await screen.findByText(offer.name)

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })

    describe('Venue section', () => {
      it('should display venue section', async () => {
        renderOfferBody({})

        await screen.findByText(offerResponseSnap.name)

        expect(screen.getByText('Copier l’adresse')).toBeOnTheScreen()
      })

      it('should display venue distance tag when user share his position', async () => {
        renderOfferBody({})

        expect(await screen.findByText('à 900+ km')).toBeOnTheScreen()
      })

      it('should not display venue distance tag when user not share his position', async () => {
        mockPosition = null
        renderOfferBody({})

        await screen.findByText(offerResponseSnap.name)

        expect(screen.queryByText('à 900+ km')).not.toBeOnTheScreen()
      })
    })
  })

  describe('About section', () => {
    it('should display about section', async () => {
      const offer: OfferResponseV2 = {
        ...offerResponseSnap,
        description: 'Cette offre est super cool cool cool cool cool cool',
        extraData: {
          speaker: 'Toto',
        },
        accessibility: {
          audioDisability: true,
          mentalDisability: true,
          motorDisability: false,
          visualDisability: false,
        },
      }
      renderOfferBody({ offer })

      await screen.findByText(offerResponseSnap.name)

      expect(screen.getByText('À propos')).toBeOnTheScreen()
    })

    it('should not display about section', async () => {
      const offer: OfferResponseV2 = {
        ...offerResponseSnap,
        description: undefined,
        extraData: {},
        accessibility: {},
      }
      renderOfferBody({ offer })

      await screen.findByText(offerResponseSnap.name)

      expect(screen.queryByText('À propos')).not.toBeOnTheScreen()
    })
  })

  describe('MovieScreeningCalendar', () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
      stocks: [
        {
          beginningDatetime: '2024-02-27T11:10:00Z',
          features: ['VO'],
          id: 6091,
          isBookable: false,
          isExpired: false,
          isForbiddenToUnderage: false,
          isSoldOut: true,
          price: 570,
        },
      ],
    }

    it('should render <MovieScreeningCalendar /> when offer is a movie screening', async () => {
      renderOfferBody({
        offer,
      })

      expect(await screen.findByLabelText('Mardi 27 Février')).toBeOnTheScreen()
    })
  })

  it('should redirect to artist page when FF is enabled, artist not contain a comma or a semicolon, and artist name is not collectif/s', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: 'Stephen King' },
    }

    renderOfferBody({
      offer,
      subcategory: mockSubcategoryBook,
    })

    await user.press(await screen.findByText('Stephen King'))

    expect(mockNavigate).toHaveBeenCalledWith('Artist', { fromOfferId: offerResponseSnap.id })
  })

  it('should not redirect to artist page when FF is enabled artist contain a comma', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: 'Stephen King, Clive Barker' },
    }

    renderOfferBody({
      offer,
      subcategory: mockSubcategoryBook,
    })

    await user.press(await screen.findByText('Stephen King, Clive Barker'))

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not redirect to artist page when FF is enabled artist contain a semicolon', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: 'Stephen King; Clive Barker' },
    }

    renderOfferBody({
      offer,
      subcategory: mockSubcategoryBook,
    })

    await user.press(await screen.findByText('Stephen King; Clive Barker'))

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not redirect to artist page when FF is enabled and artist name is collectif/s"', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: 'Collectif' },
    }

    renderOfferBody({
      offer,
      subcategory: mockSubcategoryBook,
    })

    await user.press(await screen.findByText('Collectif'))

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not redirect to artist page when FF is enabled and artist has less than 2 offers"', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: 'J.K Rowling' },
    }

    useArtistResultsSpy.mockReturnValueOnce({
      artistPlaylist: mockedAlgoliaOffersWithSameArtistResponse.slice(0, 1),
      artistTopOffers: mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4),
    })

    renderOfferBody({
      offer,
      subcategory: mockSubcategoryBook,
    })

    await user.press(await screen.findByText('J.K Rowling'))

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should log ConsultArtist when pressing artist name button and FF is enabled', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: 'Stephen King' },
    }

    renderOfferBody({
      offer,
      subcategory: mockSubcategoryBook,
    })

    await user.press(await screen.findByText('Stephen King'))

    expect(analytics.logConsultArtist).toHaveBeenNthCalledWith(1, {
      offerId: offerResponseSnap.id,
      artistName: 'Stephen King',
      from: 'offer',
    })
  })

  it('should not log ConsultArtist when pressing artist name if artist name contain a comma and FF is enabled', async () => {
    const artists = 'Stephen King, Robert McCammon'
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: artists },
    }

    renderOfferBody({
      offer,
      subcategory: mockSubcategoryBook,
    })

    await user.press(await screen.findByText('Stephen King, Robert McCammon'))

    expect(analytics.logConsultArtist).not.toHaveBeenCalled()
  })

  it('should not log ConsultArtist when pressing artist name if artist name contain a semicolon and FF is enabled', async () => {
    const artists = 'Stephen King; Robert McCammon'
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: artists },
    }

    renderOfferBody({
      offer,
      subcategory: mockSubcategoryBook,
    })

    await user.press(await screen.findByText('Stephen King; Robert McCammon'))

    expect(analytics.logConsultArtist).not.toHaveBeenCalled()
  })

  it('should not redirect to artist page when FF is disabled', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      extraData: { author: 'Stephen King', ean: '123456' },
    }

    setFeatureFlags()

    renderOfferBody({
      offer,
      subcategory: mockSubcategoryBook,
    })

    await user.press(await screen.findByText('Stephen King'))

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  type RenderOfferBodyType = Partial<ComponentProps<typeof OfferBody>> & {
    isDesktopViewport?: boolean
  }

  function renderOfferBody({
    offer = offerResponseSnap,
    subcategory = mockSubcategory,
    isDesktopViewport,
  }: RenderOfferBodyType) {
    render(
      reactQueryProviderHOC(
        <OfferBody offer={offer} subcategory={subcategory} trackEventHasSeenOfferOnce={jest.fn()} />
      ),
      {
        theme: { isDesktopViewport: isDesktopViewport ?? false },
      }
    )
  }
})
