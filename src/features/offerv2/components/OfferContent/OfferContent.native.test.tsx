import React, { ComponentProps } from 'react'
import { InViewProps } from 'react-native-intersection-observer'

import {
  CategoryIdEnum,
  HomepageLabelNameEnumv2,
  NativeCategoryIdEnumv2,
  OfferResponse,
  OnlineOfflinePlatformChoicesEnumv2,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import * as useSameArtistPlaylist from 'features/offer/components/OfferPlaylistOld/hook/useSameArtistPlaylist'
import { PlaylistType } from 'features/offer/enums'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'
import { RecommendationApiParams } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, fireEvent, waitForModalToShow } from 'tests/utils'

import { OfferContent } from './OfferContent'

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

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const apiRecoParams: RecommendationApiParams = {
  call_id: '1',
  filtered: true,
  geo_located: false,
  model_endpoint: 'default',
  model_name: 'similar_offers_default_prod',
  model_version: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
  reco_origin: 'default',
}

const useSimilarOffersSpy = jest
  .spyOn(useSimilarOffers, 'useSimilarOffers')
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

jest.spyOn(useSameArtistPlaylist, 'useSameArtistPlaylist').mockReturnValue({
  sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
})

/**
 * This mock permit to simulate the visibility of the playlist
 * it is an alternative solution which allows you to replace the scroll simulation
 * it's not optimal, if you have better idea don't hesitate to update
 */
const mockInView = jest.fn()
jest.mock('react-native-intersection-observer', () => {
  const InView = (props: InViewProps) => {
    mockInView.mockImplementation(props.onChange)
    return null
  }
  return {
    ...jest.requireActual('react-native-intersection-observer'),
    InView,
  }
})

jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider', () => ({
  useRemoteConfigContext: jest.fn().mockReturnValue({ sameAuthorPlaylist: 'withPlaylistAsFirst' }),
}))

const scrollEvent = {
  nativeEvent: {
    contentOffset: { y: 200 },
    layoutMeasurement: { height: 1000 },
    contentSize: { height: 1900 },
  },
}

const nativeEventMiddle = {
  nativeEvent: {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 400 }, // how far did we scroll
    contentSize: { height: 1900 },
  },
}

const nativeEventBottom = {
  nativeEvent: {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 900 },
    contentSize: { height: 1900 },
  },
}
const BATCH_TRIGGER_DELAY_IN_MS = 5000

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<OfferContent />', () => {
  beforeEach(() => {
    mockServer.getApiV1<SubcategoriesResponseModelv2>('/subcategories/v2', placeholderData)
    mockPosition = { latitude: 90.4773245, longitude: 90.4773245 }
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)
  })

  it('should display offer header', async () => {
    renderOfferContent({})

    await screen.findByText('Réserver l’offre')

    expect(screen.getByTestId('offerHeaderName')).toBeOnTheScreen()
  })

  describe('When WIP_OFFER_PREVIEW feature flag deactivated', () => {
    beforeEach(() => {
      jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
    })

    it('should not display linear gradient on offer image when enableOfferPreview feature flag deactivated', async () => {
      renderOfferContent({})

      await act(async () => {})

      expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
    })
  })

  it('should display linear gradient on offer image when enableOfferPreview feature flag activated', async () => {
    renderOfferContent({})

    await act(async () => {})

    expect(screen.getByTestId('image-gradient')).toBeOnTheScreen()
  })

  it('should animate on scroll', async () => {
    renderOfferContent({})

    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(0)

    await act(async () => {
      const scrollContainer = screen.getByTestId('offerv2-container')
      fireEvent.scroll(scrollContainer, scrollEvent)
    })

    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(1)
  })

  describe('Tags section', () => {
    it('should display tags', async () => {
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.getByText('Cinéma plein air')).toBeOnTheScreen()
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

      renderOfferContent({
        offer,
        subcategory,
      })

      await screen.findByText('Réserver l’offre')

      expect(screen.getByText('Metal')).toBeOnTheScreen()
      expect(screen.getByText('Industrial')).toBeOnTheScreen()
      expect(screen.getByText('Vinyles et autres supports')).toBeOnTheScreen()
    })
  })

  it('should display offer as a title', async () => {
    renderOfferContent({})

    await screen.findByText('Réserver l’offre')

    expect(
      screen.getByLabelText('Nom de l’offre\u00a0: Sous les étoiles de Paris - VF')
    ).toBeOnTheScreen()
  })

  it('should display artists', async () => {
    const offer: OfferResponse = {
      ...offerResponseSnap,
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      extraData: { stageDirector: 'Marion Cotillard, Leonardo DiCaprio' },
    }
    renderOfferContent({
      offer,
    })

    await screen.findByText('Réserver l’offre')

    expect(screen.getByText('de Marion Cotillard, Leonardo DiCaprio')).toBeOnTheScreen()
  })

  it('should display prices', async () => {
    renderOfferContent({})

    await screen.findByText('Réserver l’offre')

    expect(screen.getByText('5,00 €')).toBeOnTheScreen()
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

    renderOfferContent({ offer: offerFree })

    await screen.findByText('Réserver l’offre')

    expect(screen.queryByText('5,00 €')).not.toBeOnTheScreen()
  })

  describe('Venue button section & Summary info section', () => {
    it('should display both section', async () => {
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.getByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')).toBeOnTheScreen()
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

      renderOfferContent({ offer })

      await screen.findByText('Réserver l’offre')

      expect(
        screen.queryByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')
      ).not.toBeOnTheScreen()
      expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
    })

    it('should display top separator between this two section', async () => {
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.getByTestId('topSeparator')).toBeOnTheScreen()
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
      renderOfferContent({ offer })

      await screen.findByText('Réserver l’offre')

      expect(screen.queryByTestId('topSeparator')).not.toBeOnTheScreen()
    })

    describe('Venue button section', () => {
      it('should display venue button', async () => {
        renderOfferContent({})

        await screen.findByText('Réserver l’offre')

        expect(screen.getByTestId('Accéder à la page du lieu PATHE BEAUGRENELLE')).toBeOnTheScreen()
      })

      it('should not display venue button', async () => {
        const offer: OfferResponse = {
          ...offerResponseSnap,
          venue: {
            ...offerResponseSnap.venue,
            isPermanent: false,
          },
        }
        renderOfferContent({ offer })

        await screen.findByText('Réserver l’offre')

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
        renderOfferContent({ offer })

        await screen.findByText('Réserver l’offre')

        expect(screen.getByText('Duo')).toBeOnTheScreen()
      })

      it('should not display duo info', async () => {
        const offer: OfferResponse = {
          ...offerResponseSnap,
          isDuo: false,
        }
        renderOfferContent({ offer })

        await screen.findByText('Réserver l’offre')

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })
  })

  describe('Venue section', () => {
    it('should display venue section', async () => {
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.getByText('Copier l’adresse')).toBeOnTheScreen()
    })

    it('should display venue distance tag when user share his position', async () => {
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.getByText('à 900+ km')).toBeOnTheScreen()
    })

    it('should not display venue distance tag when user not share his position', async () => {
      mockPosition = null
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.queryByText('à 900+ km')).not.toBeOnTheScreen()
    })
  })

  it('should display social network section', async () => {
    renderOfferContent({})

    await screen.findByText('Réserver l’offre')

    expect(screen.getByText('Passe le bon plan\u00a0!')).toBeOnTheScreen()
  })

  describe('Playlist list section', () => {
    describe('Same artist playlist', () => {
      const extraData = {
        author: 'Eiichiro Oda',
        ean: '9782723492607',
      }

      it('should display same artist playlist', async () => {
        renderOfferContent({ offer: { ...offerResponseSnap, extraData } })

        await screen.findByText('Réserver l’offre')

        expect(screen.getByText('Du même auteur')).toBeOnTheScreen()
      })

      it('should trigger logSameArtistPlaylistVerticalScroll when scrolling to the playlist', async () => {
        renderOfferContent({})

        mockInView(true)

        await screen.findByText('Réserver l’offre')

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
          nbResults: 30,
        })
      })

      it('should trigger only once time logSameArtistPlaylistVerticalScroll when scrolling to the playlist', async () => {
        renderOfferContent({})

        mockInView(true)
        mockInView(false)
        mockInView(true)

        await screen.findByText('Réserver l’offre')

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
      })

      it('should not trigger logSameArtistPlaylistVerticalScroll when not scrolling to the playlist', async () => {
        renderOfferContent({})

        mockInView(false)

        await screen.findByText('Réserver l’offre')

        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalled()
      })
    })

    describe('Same category similar offers', () => {
      it('should display same category similar offers', async () => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        renderOfferContent({})

        await screen.findByText('Réserver l’offre')

        expect(screen.getByText('Dans la même catégorie')).toBeOnTheScreen()
      })

      it('should trigger logSameCategoryPlaylistVerticalScroll when scrolling to the playlist', async () => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        renderOfferContent({})

        mockInView(true)

        await screen.findByText('Réserver l’offre')

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
          nbResults: 4,
          ...apiRecoParams,
        })
      })

      it('should trigger only once time logSameCategoryPlaylistVerticalScroll when scrolling to the playlist', async () => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        renderOfferContent({})

        mockInView(true)
        mockInView(false)
        mockInView(true)

        await screen.findByText('Réserver l’offre')

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
      })

      it('should not trigger logSameCategoryPlaylistVerticalScroll when not scrolling to the playlist', async () => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        renderOfferContent({})

        mockInView(false)

        await screen.findByText('Réserver l’offre')

        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalled()
      })
    })

    describe('Other categories similar offers', () => {
      it('should display other categories similar offer', async () => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        renderOfferContent({})

        await screen.findByText('Réserver l’offre')

        expect(screen.getByText('Ça peut aussi te plaire')).toBeOnTheScreen()
      })

      it('should trigger logOtherCategoriesPlaylistVerticalScroll when scrolling to the playlist', async () => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        renderOfferContent({})

        mockInView(true)

        await screen.findByText('Réserver l’offre')

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
          nbResults: 4,
          ...apiRecoParams,
        })
      })

      it('should trigger only once time logOtherCategoriesPlaylistVerticalScroll when scrolling to the playlist', async () => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        renderOfferContent({})

        mockInView(true)
        mockInView(false)
        mockInView(true)

        await screen.findByText('Réserver l’offre')

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
      })

      it('should not trigger logOtherCategoriesPlaylistVerticalScroll when not scrolling to the playlist', async () => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        renderOfferContent({})

        mockInView(false)

        await screen.findByText('Réserver l’offre')

        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalled()
      })
    })
  })

  describe('Offer booking button', () => {
    it('should display "Réserver l’offre" button', async () => {
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.getByText('Réserver l’offre')).toBeOnTheScreen()
    })

    it('should log analytics when display authentication modal', async () => {
      mockUseAuthContext.mockImplementationOnce(() => ({
        isLoggedIn: false,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
      }))

      renderOfferContent({})

      const bookingOfferButton = await screen.findByText('Réserver l’offre')
      await act(async () => {
        fireEvent.press(bookingOfferButton)
      })

      waitForModalToShow()

      expect(analytics.logConsultAuthenticationModal).toHaveBeenNthCalledWith(
        1,
        offerResponseSnap.id
      )
    })

    it('should trigger logEvent "ConsultAllOffer" when reaching the end', async () => {
      renderOfferContent({})
      const scrollView = screen.getByTestId('offerv2-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventMiddle)
      })

      expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      await screen.findByText('Réserver l’offre')

      expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerResponseSnap.id)
    })

    it('should trigger logEvent "ConsultAllOffer" only once', async () => {
      renderOfferContent({})
      const scrollView = screen.getByTestId('offerv2-container')
      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logConsultWholeOffer).toHaveBeenCalledTimes(1)

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventMiddle)
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      await screen.findByText('Réserver l’offre')

      expect(analytics.logConsultWholeOffer).toHaveBeenCalledTimes(1)
    })
  })

  describe('Batch trigger', () => {
    it('should trigger has_seen_offer_for_survey event after 5 seconds', async () => {
      renderOfferContent({})

      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

      await screen.findByText('Réserver l’offre')

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event before 5 seconds have elapsed', async () => {
      renderOfferContent({})

      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 1)

      await screen.findByText('Réserver l’offre')

      expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event on scroll to bottom', async () => {
      renderOfferContent({})

      fireEvent.scroll(screen.getByTestId('offerv2-container'), nativeEventBottom)

      await screen.findByText('Réserver l’offre')

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event on scroll to middle', async () => {
      renderOfferContent({})

      fireEvent.scroll(screen.getByTestId('offerv2-container'), nativeEventMiddle)

      await screen.findByText('Réserver l’offre')

      expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event once on scroll to bottom and after 5 seconds', async () => {
      renderOfferContent({})

      fireEvent.scroll(screen.getByTestId('offerv2-container'), nativeEventBottom)
      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

      await screen.findByText('Réserver l’offre')

      expect(BatchUser.trackEvent).toHaveBeenCalledTimes(3) // Three different Batch events are triggered on this page
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOffer)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenCinemaOfferForSurvey)
    })

    it.each([
      NativeCategoryIdEnumv2.BIBLIOTHEQUE,
      NativeCategoryIdEnumv2.CONCOURS,
      NativeCategoryIdEnumv2.MATERIELS_CREATIFS,
      NativeCategoryIdEnumv2.CARTES_JEUNES,
    ])(
      'should not trigger has_seen_offer_for_survey event for uneligible offer type %s',
      async (nativeCategoryId) => {
        renderOfferContent({ subcategory: { ...mockSubcategory, nativeCategoryId } })

        //await act(() => {})
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

        await screen.findByText('Réserver l’offre')

        expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
      }
    )

    it.each`
      nativeCategoryId                              | expectedBatchEvent
      ${NativeCategoryIdEnumv2.SEANCES_DE_CINEMA}   | ${BatchEvent.hasSeenCinemaOfferForSurvey}
      ${NativeCategoryIdEnumv2.VISITES_CULTURELLES} | ${BatchEvent.hasSeenCulturalVisitForSurvey}
      ${NativeCategoryIdEnumv2.LIVRES_PAPIER}       | ${BatchEvent.hasSeenBookOfferForSurvey}
      ${NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS} | ${BatchEvent.hasSeenConcertForSurvey}
    `(
      'should trigger $expectedBatchEvent batch event for offer type $nativeCategoryId',
      async ({ nativeCategoryId, expectedBatchEvent }) => {
        renderOfferContent({ subcategory: { ...mockSubcategory, nativeCategoryId } })

        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

        await screen.findByText('Réserver l’offre')

        expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
        expect(BatchUser.trackEvent).toHaveBeenCalledWith(expectedBatchEvent)
      }
    )
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
      renderOfferContent({
        offer,
      })

      expect(await screen.findByLabelText('Mardi 27 février')).toBeOnTheScreen()
    })
  })
})

type RenderOfferContentType = Partial<ComponentProps<typeof OfferContent>>

function renderOfferContent({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
}: RenderOfferContentType) {
  render(
    reactQueryProviderHOC(
      <OfferContent
        offer={offer}
        searchGroupList={placeholderData.searchGroups}
        subcategory={subcategory}
      />
    )
  )
}
