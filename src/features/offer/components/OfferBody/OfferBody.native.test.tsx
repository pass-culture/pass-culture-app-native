import React, { ComponentProps } from 'react'

import {
  OfferResponse,
  SubcategoryIdEnum,
  CategoryIdEnum,
  SearchGroupNameEnumv2,
  HomepageLabelNameEnumv2,
  OnlineOfflinePlatformChoicesEnumv2,
  NativeCategoryIdEnumv2,
} from 'api/gen'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place/types'
import { Subcategory } from 'libs/subcategories/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
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

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('<OfferBody />', () => {
  beforeEach(() => {
    mockPosition = { latitude: 90.4773245, longitude: 90.4773245 }
  })

  describe('Tags section', () => {
    it('should display tags', async () => {
      renderOfferBody({})

      expect(await screen.findByText('Cinéma plein air')).toBeOnTheScreen()
    })

    it('should display vinyl tag', async () => {
      const offer: OfferResponse = {
        ...offerResponseSnap,
        subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
        extraData: { musicType: 'Metal', musicSubType: 'Industrial' },
      }
      const subcategory: Subcategory = {
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
    const offer: OfferResponse = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      extraData: { stageDirector: 'Marion Cotillard, Leonardo DiCaprio' },
    }
    renderOfferBody({
      offer,
    })

    expect(await screen.findByText('de Marion Cotillard, Leonardo DiCaprio')).toBeOnTheScreen()
  })

  it('should display prices', async () => {
    renderOfferBody({})

    expect(await screen.findByText('5,00 €')).toBeOnTheScreen()
  })

  it('should not display prices when the offer is free', async () => {
    const offerFree: OfferResponse = {
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
    it('should display both section', async () => {
      renderOfferBody({})

      expect(
        await screen.findByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')
      ).toBeOnTheScreen()
      expect(screen.getByText('Duo')).toBeOnTheScreen()
    })

    it('should not display both section', async () => {
      const offer: OfferResponse = {
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
      const offer: OfferResponse = {
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

    it('should display top separator between this two section', async () => {
      renderOfferBody({})

      expect(await screen.findByTestId('topSeparator')).toBeOnTheScreen()
    })

    describe('Venue button section', () => {
      it('should display venue button', async () => {
        renderOfferBody({})

        expect(
          await screen.findByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')
        ).toBeOnTheScreen()
      })

      it('should not display venue button', async () => {
        const offer: OfferResponse = {
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
    })

    describe('Summary info section', () => {
      it('should display duo info', async () => {
        const offer: OfferResponse = {
          ...offerResponseSnap,
          isDuo: true,
        }
        renderOfferBody({ offer })

        expect(await screen.findByText('Duo')).toBeOnTheScreen()
      })

      it('should not display duo info', async () => {
        const offer: OfferResponse = {
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

  describe('MovieScreeningCalendar', () => {
    const offer: OfferResponse = {
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

      expect(await screen.findByLabelText('Mardi 27 février')).toBeOnTheScreen()
    })
  })

  it('should display social network section', async () => {
    renderOfferBody({})

    expect(await screen.findByText('Passe le bon plan\u00a0!')).toBeOnTheScreen()
  })

  it('should display container with divider on mobile', async () => {
    renderOfferBody({})

    await screen.findByText(offerResponseSnap.name)

    expect(screen.getByTestId('messagingApp-container-with-divider')).toBeOnTheScreen()
  })

  it('should not display container with divider on desktop', async () => {
    renderOfferBody({ isDesktopViewport: true })

    await screen.findByText(offerResponseSnap.name)

    expect(screen.queryByTestId('messagingApp-container-with-divider')).not.toBeOnTheScreen()
  })

  it('should display container without divider on desktop', async () => {
    renderOfferBody({
      isDesktopViewport: true,
    })

    await screen.findByText(offerResponseSnap.name)

    expect(screen.getByTestId('messagingApp-container-without-divider')).toBeOnTheScreen()
  })

  it('should not display container without divider on mobile', async () => {
    renderOfferBody({})

    await screen.findByText(offerResponseSnap.name)

    expect(screen.queryByTestId('messagingApp-container-without-divider')).not.toBeOnTheScreen()
  })
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
