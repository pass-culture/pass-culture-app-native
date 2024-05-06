import React, { ComponentProps } from 'react'

import {
  OfferResponseV2,
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
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place/types'
import { Subcategory } from 'libs/subcategories/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

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

const mockUseFeatureFlag = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

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
      const offer: OfferResponseV2 = {
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

    expect(await screen.findByText('5,00 €')).toBeOnTheScreen()
  })

  it('should display reaction button when feature flag is enabled and native category is "Séances de cinéma"', async () => {
    renderOfferBody({})

    expect(await screen.findByText('Réagir')).toBeOnTheScreen()
  })

  it('should open survey modal when pressing "Réagir" button', async () => {
    renderOfferBody({})

    fireEvent.press(await screen.findByText('Réagir'))

    expect(screen.getByText('Encore un peu de patience…')).toBeOnTheScreen()
  })

  it('should log reaction fake door consultation when pressing  "Réagir" button', async () => {
    renderOfferBody({})

    fireEvent.press(await screen.findByText('Réagir'))

    expect(analytics.logConsultReactionFakeDoor).toHaveBeenCalledTimes(1)
  })

  it('should not display reaction button when feature flag is enabled and native category is not "Séances de cinéma"', async () => {
    renderOfferBody({
      offer: {
        ...offerResponseSnap,
        subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      },
      subcategory: {
        ...mockSubcategory,
        nativeCategoryId: NativeCategoryIdEnumv2.VINYLES,
      },
    })
    await screen.findByText(offerResponseSnap.name)

    expect(screen.queryByText('Réagir')).not.toBeOnTheScreen()
  })

  it('should not display reaction button when feature flag is disabled', async () => {
    // eslint-disable-next-line local-rules/independent-mocks -- we have multiple renders
    mockUseFeatureFlag.mockReturnValue(false)

    renderOfferBody({})
    await screen.findByText(offerResponseSnap.name)

    expect(screen.queryByText('Réagir')).not.toBeOnTheScreen()

    // eslint-disable-next-line local-rules/independent-mocks -- to reset the mock
    mockUseFeatureFlag.mockReturnValue(true)
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

    it('should not display top separator when venue button is displayed', async () => {
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
