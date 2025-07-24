import { NavigationContainer } from '@react-navigation/native'
import { addDays } from 'date-fns'
import mockdate from 'mockdate'
import React, { ComponentProps } from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { api } from 'api/api'
import {
  FavoriteResponse,
  GetRemindersResponse,
  NativeCategoryIdEnumv2,
  OfferResponseV2,
  PaginatedFavoritesResponse,
  RecommendationApiParams,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
  SubcategoryIdEnumv2,
  UserProfileResponse,
} from 'api/gen'
import { favoriteResponseSnap } from 'features/favorites/fixtures/favoriteResponseSnap'
import * as useFavorite from 'features/favorites/hooks/useFavorite'
import * as useGoBack from 'features/navigation/useGoBack'
import { chroniclePreviewToChronicalCardData } from 'features/offer/adapters/chroniclePreviewToChronicleCardData'
import { CineContentCTAID } from 'features/offer/components/OfferCine/CineContentCTA'
import { PlaylistType } from 'features/offer/enums'
import { chronicleVariantInfoFixture } from 'features/offer/fixtures/chronicleVariantInfo'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { videoDataFixture } from 'features/offer/fixtures/videoDataFixture'
import * as useSimilarOffersAPI from 'features/offer/queries/useSimilarOffersQuery'
import { beneficiaryUser } from 'fixtures/user'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place/types'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import * as useArtistResultsAPI from 'queries/offer/useArtistResultsQuery'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, cleanup, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import * as AnchorContextModule from 'ui/components/anchor/AnchorContext'

import { OfferContent } from './OfferContent'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/jwt/jwt')

const useFavoriteSpy = jest.spyOn(useFavorite, 'useFavorite')
const spyApiDeleteFavorite = jest.spyOn(api, 'deleteNativeV1MeFavoritesfavoriteId')

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

let mockComingSoonFooterHeight = 0
jest.mock('ui/hooks/useLayout', () => ({
  useLayout: () => ({
    height: mockComingSoonFooterHeight,
    onLayout: jest.fn(),
  }),
}))

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

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
  useRoute: () => ({ params: { id: 123 } }),
}))

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('features/auth/context/AuthContext')

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
  .spyOn(useSimilarOffersAPI, 'useSimilarOffersQuery')
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

jest.spyOn(useArtistResultsAPI, 'useArtistResultsQuery').mockReturnValue({
  artistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
  artistTopOffers: mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4),
})

const mockInView = jest.fn()
const InViewMock = ({
  onChange,
  children,
}: {
  onChange: VoidFunction
  children: React.ReactNode
}) => {
  mockInView.mockImplementation(onChange)
  return <React.Fragment>{children}</React.Fragment>
}

jest.mock('react-native-intersection-observer', () => {
  return {
    ...jest.requireActual('react-native-intersection-observer'),
    InView: InViewMock,
    mockInView,
  }
})

const useScrollToAnchorSpy = jest.spyOn(AnchorContextModule, 'useScrollToAnchor')
const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue({
    ...remoteConfigResponseFixture,
    data: {
      ...DEFAULT_REMOTE_CONFIG,
      sameAuthorPlaylist: 'withPlaylistAsFirst',
      reactionFakeDoorCategories: {
        categories: [
          NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
          NativeCategoryIdEnumv2.CD,
          NativeCategoryIdEnumv2.MUSIQUE_EN_LIGNE,
          NativeCategoryIdEnumv2.VINYLES,
          NativeCategoryIdEnumv2.LIVRES_AUDIO_PHYSIQUES,
          NativeCategoryIdEnumv2.LIVRES_NUMERIQUE_ET_AUDIO,
          NativeCategoryIdEnumv2.LIVRES_PAPIER,
          NativeCategoryIdEnumv2.DVD_BLU_RAY,
        ],
      },
    },
  })

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

const mockOnLayoutWithButton = {
  nativeEvent: {
    layout: {
      height: 157,
    },
  },
}

const BATCH_TRIGGER_DELAY_IN_MS = 5000

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

describe('<OfferContent />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    spyApiDeleteFavorite.mockResolvedValue({})
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockServer.getApi<GetRemindersResponse>('/v1/me/reminders', {})
    useFavoriteSpy.mockReturnValue(favoriteResponseSnap)
    mockPosition = { latitude: 90.4773245, longitude: 90.4773245 }
    mockAuthContextWithoutUser({ persist: true })
    setFeatureFlags([RemoteStoreFeatureFlags.TARGET_XP_CINE_FROM_OFFER])
  })

  afterEach(cleanup)

  describe('Header', () => {
    it('should display offer header', async () => {
      renderOfferContent({})

      expect(await screen.findByTestId('offerHeaderName')).toBeOnTheScreen()
    })

    it('should remove favorite when press on favorite', async () => {
      mockAuthContextWithUser({ id: 1, email: 'user@test.com' } as UserProfileResponse)
      renderOfferContent({})
      const button = await screen.findByLabelText('Mettre en favori')
      await user.press(button)

      expect(spyApiDeleteFavorite).toHaveBeenCalledWith(favoriteResponseSnap.id)
    })

    it('should display snackbar when remove favorite fails', async () => {
      spyApiDeleteFavorite.mockRejectedValueOnce({ status: 400 })
      mockAuthContextWithUser({ id: 1, email: 'user@test.com' } as UserProfileResponse)
      renderOfferContent({})
      const button = await screen.findByLabelText('Mettre en favori')
      await user.press(button)

      expect(spyApiDeleteFavorite).toHaveBeenCalledWith(favoriteResponseSnap.id)
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'L’offre n’a pas été retirée de tes favoris' })
      )
    })
  })

  it('should navigate to offer preview screen when clicking on image offer', async () => {
    renderOfferContent({})

    await user.press(await screen.findByLabelText('Carousel image 1'))

    expect(mockNavigate).toHaveBeenCalledWith('OfferPreview', { id: 116656, defaultIndex: 0 })
  })

  it('should navigate to offer preview screen when clicking on placeholder image', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      images: null,
    }
    renderOfferContent({ offer })

    await user.press(await screen.findByLabelText('Carousel image 1'))

    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled())
  })

  it('should animate on scroll', async () => {
    renderOfferContent({})

    await screen.findByText('Réserver l’offre')

    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(0)

    fireEvent.scroll(await screen.findByTestId('offerv2-container'), scrollEvent)

    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(1)
  })

  describe('Playlist list section', () => {
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

      expect(await screen.findByText('Réserver l’offre')).toBeOnTheScreen()
    })

    it('should log analytics when display authentication modal', async () => {
      renderOfferContent({})

      await user.press(await screen.findByText('Réserver l’offre'))

      expect(analytics.logConsultAuthenticationModal).toHaveBeenNthCalledWith(
        1,
        offerResponseSnap.id
      )
    })

    it('should trigger logEvent "ConsultAllOffer" when reaching the end', async () => {
      renderOfferContent({})
      const scrollView = await screen.findByTestId('offerv2-container')

      fireEvent.scroll(scrollView, nativeEventMiddle)

      expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()

      fireEvent.scroll(scrollView, nativeEventBottom)

      await screen.findByText('Réserver l’offre')

      expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerResponseSnap.id)
    })

    it('should trigger logEvent "ConsultAllOffer" only once', async () => {
      renderOfferContent({})
      const scrollView = await screen.findByTestId('offerv2-container')

      fireEvent.scroll(scrollView, nativeEventBottom)

      expect(analytics.logConsultWholeOffer).toHaveBeenCalledTimes(1)

      fireEvent.scroll(scrollView, nativeEventMiddle)
      fireEvent.scroll(scrollView, nativeEventBottom)

      await screen.findByText('Réserver l’offre')

      expect(analytics.logConsultWholeOffer).toHaveBeenCalledTimes(1)
    })
  })

  describe('Offer footer', () => {
    describe('favorite button', () => {
      const comingSoonOffer = {
        ...offerResponseSnap,
        isReleased: false,
        publicationDate: addDays(new Date(), 20).toString(),
      }
      mockdate.set(new Date('2025-03-31T10:00:00Z'))

      it('should display "Mettre en favori" button', async () => {
        useFavoriteSpy.mockReturnValueOnce(undefined)
        renderOfferContent({ offer: comingSoonOffer })
        await screen.findByText('Cette offre sera bientôt disponible')

        expect(await screen.findByText('Mettre en favori')).toBeOnTheScreen()
      })

      describe('analytics', () => {
        beforeEach(() => {
          useFavoriteSpy.mockReturnValueOnce(undefined)
          mockAuthContextWithUser(beneficiaryUser, { persist: true })
          const favoritesResponseWithoutOfferIn: PaginatedFavoritesResponse = {
            page: 1,
            nbFavorites: 0,
            favorites: [],
          }
          const favoriteResponse: FavoriteResponse = favoriteResponseSnap
          mockServer.getApi<PaginatedFavoritesResponse>(
            '/v1/me/favorites',
            favoritesResponseWithoutOfferIn
          )
          mockServer.postApi('/v1/me/favorites', favoriteResponse)
        })

        it('should send logHasAddedOfferToFavorites event with correct params', async () => {
          renderOfferContent({ offer: comingSoonOffer })

          await screen.findAllByText(comingSoonOffer.name)

          await user.press(await screen.findByText('Mettre en favori'))

          expect(analytics.logHasAddedOfferToFavorites).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({ offerId: comingSoonOffer.id, from: 'comingSoonOffer' })
          )
        })
      })
    })
  })

  describe('Batch trigger', () => {
    it('should trigger has_seen_offer_for_survey event after 5 seconds', async () => {
      renderOfferContent({})

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      await screen.findByText('Réserver l’offre')

      expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event before 5 seconds have elapsed', async () => {
      renderOfferContent({})

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 1)
      })

      await screen.findByText('Réserver l’offre')

      expect(BatchProfile.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event on scroll to bottom', async () => {
      renderOfferContent({})

      fireEvent.scroll(await screen.findByTestId('offerv2-container'), nativeEventBottom)

      expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event on scroll to middle', async () => {
      renderOfferContent({})

      fireEvent.scroll(await screen.findByTestId('offerv2-container'), nativeEventMiddle)

      expect(BatchProfile.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event once on scroll to bottom and after 5 seconds', async () => {
      renderOfferContent({})

      await screen.findByTestId('sticky-booking-button')

      fireEvent.scroll(await screen.findByTestId('offerv2-container'), nativeEventBottom)

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      expect(BatchProfile.trackEvent).toHaveBeenCalledTimes(3) // Three different Batch events are triggered on this page
      expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOffer)
      expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
      expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenCinemaOfferForSurvey)
    })

    it.each([
      SubcategoryIdEnumv2.ABO_BIBLIOTHEQUE,
      SubcategoryIdEnumv2.CONCOURS,
      SubcategoryIdEnumv2.MATERIEL_ART_CREATIF,
      SubcategoryIdEnumv2.CARTE_JEUNES,
    ])(
      'should not trigger has_seen_offer_for_survey event for uneligible offer type %s',
      async (subcategoryId) => {
        renderOfferContent({ subcategory: { ...mockSubcategory, id: subcategoryId } })

        await act(async () => {
          jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
        })

        await screen.findByText('Réserver l’offre')

        expect(BatchProfile.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
      }
    )

    it.each`
      subcategoryId                       | expectedBatchEvent
      ${SubcategoryIdEnumv2.SEANCE_CINE}  | ${BatchEvent.hasSeenCinemaOfferForSurvey}
      ${SubcategoryIdEnumv2.VISITE}       | ${BatchEvent.hasSeenCulturalVisitForSurvey}
      ${SubcategoryIdEnumv2.LIVRE_PAPIER} | ${BatchEvent.hasSeenBookOfferForSurvey}
      ${SubcategoryIdEnumv2.CONCERT}      | ${BatchEvent.hasSeenConcertForSurvey}
    `(
      'should trigger $expectedBatchEvent batch event for offer type $subcategoryId',
      async ({ subcategoryId, expectedBatchEvent }) => {
        renderOfferContent({ subcategory: { ...mockSubcategory, id: subcategoryId } })

        await act(async () => {
          jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
        })

        await screen.findByText('Réserver l’offre')

        expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
        expect(BatchProfile.trackEvent).toHaveBeenCalledWith(expectedBatchEvent)
      }
    )
  })

  it('should display mobile body on mobile', async () => {
    renderOfferContent({})

    expect(await screen.findByTestId('offer-body-mobile')).toBeOnTheScreen()
  })

  it('should not display desktop body on mobile', async () => {
    renderOfferContent({})

    await screen.findByText('Réserver l’offre')

    expect(screen.queryByTestId('offer-body-desktop')).not.toBeOnTheScreen()
  })

  it('should display sticky booking button on mobile', async () => {
    renderOfferContent({})

    expect(await screen.findByTestId('sticky-booking-button')).toBeOnTheScreen()
  })

  it('should not display nonadhesive booking button on mobile', async () => {
    renderOfferContent({})

    await screen.findByText('Réserver l’offre')

    expect(screen.queryByTestId('booking-button')).not.toBeOnTheScreen()
  })

  describe('movie screening access button', () => {
    describe('with remote config activated', () => {
      beforeAll(() => {
        useRemoteConfigSpy.mockReturnValue({
          ...remoteConfigResponseFixture,
          data: {
            ...DEFAULT_REMOTE_CONFIG,
            showAccessScreeningButton: true,
          },
        })
      })

      it('should not appear if the offer is not a movie screening', async () => {
        renderOfferContent({
          offer: { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE },
        })

        await act(async () => {
          mockInView(false)
        })

        await screen.findAllByText(offerResponseSnap.name)

        expect(screen.queryByTestId(CineContentCTAID)).not.toBeOnTheScreen()
      })

      it('should show button', async () => {
        renderOfferContent({
          offer: { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
        })

        await act(async () => {
          mockInView(false)
        })

        await screen.findByText('Trouve ta séance')

        expect(await screen.findByTestId(CineContentCTAID)).toBeOnTheScreen()
      })

      it('should scroll to anchor', async () => {
        renderOfferContent({
          offer: { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
        })

        await act(async () => {
          mockInView(false)
        })

        const button = await screen.findByTestId(CineContentCTAID)

        await userEvent.press(button)

        expect(useScrollToAnchorSpy).toHaveBeenCalledWith()
      })
    })

    describe('with remote config deactivated', () => {
      beforeAll(() => {
        useRemoteConfigSpy.mockReturnValue({
          ...remoteConfigResponseFixture,
          data: {
            ...DEFAULT_REMOTE_CONFIG,
            showAccessScreeningButton: false,
          },
        })
      })

      it('should not display the button if the remote config flag is deactivated', async () => {
        renderOfferContent({
          offer: { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
        })

        await act(async () => {
          mockInView(false)
        })

        await screen.findByText('Trouve ta séance')

        expect(screen.queryByTestId(CineContentCTAID)).not.toBeOnTheScreen()
      })
    })

    describe('Chronicles section', () => {
      it('should not display chronicles section when there are no chronicles', async () => {
        renderOfferContent({
          offer: {
            ...offerResponseSnap,
            subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
            chronicles: [],
          },
        })

        await screen.findByText('Passe le bon plan\u00a0!')

        expect(screen.queryByText("L'avis du book club")).not.toBeOnTheScreen()
      })

      it('should display "Voir tous les avis" button', async () => {
        renderOfferContent({
          offer: { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
        })

        expect(await screen.findByText('Voir tous les avis')).toBeOnTheScreen()
      })

      it('should navigate to chronicles page when pressing "Voir tous les avis" button', async () => {
        renderOfferContent({
          offer: { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
        })

        await user.press(await screen.findByText('Voir tous les avis'))

        expect(mockNavigate).toHaveBeenNthCalledWith(1, 'Chronicles', {
          offerId: 116656,
          from: 'chronicles',
        })
      })

      it('should navigate to chronicles page with anchor on the selected chronicle when pressing "Voir plus" button on a card', async () => {
        renderOfferContent({
          offer: { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
        })

        const descriptions = screen.getAllByTestId('description')

        await act(async () => {
          descriptions[0]?.props.onLayout(mockOnLayoutWithButton)
        })

        const seeMoreButtons = screen.getAllByText('Voir plus')

        // Using as because links is never undefined and the typing is not correct
        await user.press(seeMoreButtons[0] as ReactTestInstance)

        expect(mockNavigate).toHaveBeenNthCalledWith(1, 'Chronicles', {
          offerId: 116656,
          chronicleId: 1,
          from: 'chronicles',
        })
      })

      it('should log consultChronicle when pressing "Voir plus" button', async () => {
        renderOfferContent({
          offer: { ...offerResponseSnap, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
        })

        const descriptions = screen.getAllByTestId('description')

        await act(async () => {
          descriptions[0]?.props.onLayout(mockOnLayoutWithButton)
        })

        const seeMoreButtons = screen.getAllByText('Voir plus')

        // Using as because links is never undefined and the typing is not correct
        await user.press(seeMoreButtons[0] as ReactTestInstance)

        expect(analytics.logConsultChronicle).toHaveBeenNthCalledWith(1, {
          offerId: 116656,
          chronicleId: 1,
        })
      })
    })

    it('should display social network section', async () => {
      renderOfferContent({})

      expect(await screen.findByText('Passe le bon plan\u00a0!')).toBeOnTheScreen()
    })
  })

  describe('coming soon footer', () => {
    it('should render a footer offset when the coming soon footer has a height', async () => {
      mockComingSoonFooterHeight = 100

      renderOfferContent({})

      await screen.findByTestId('offerHeaderName')

      expect(await screen.findByTestId('coming-soon-footer-offset')).toBeOnTheScreen()
    })

    it('should not render a footer offset when the coming soon footer does not have a height', async () => {
      mockComingSoonFooterHeight = 0

      renderOfferContent({})

      await screen.findByTestId('offerHeaderName')

      expect(screen.queryByTestId('coming-soon-footer-offset')).not.toBeOnTheScreen()
    })
  })

  describe('See video button', () => {
    it('should not display see video button when video data not defined', async () => {
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.queryByText('Voir la vidéo')).not.toBeOnTheScreen()
    })

    it('should display see video button when video data defined', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION])
      renderOfferContent({ videoData: videoDataFixture })

      expect(await screen.findByText('Voir la vidéo')).toBeOnTheScreen()
    })

    it('should navigate to OfferVideoPreview screen when pressing see video button', async () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION])
      renderOfferContent({ videoData: videoDataFixture })

      await screen.findByText('Réserver l’offre')

      await user.press(screen.getByText('Voir la vidéo'))

      expect(mockNavigate).toHaveBeenCalledWith('OfferVideoPreview', {
        id: offerResponseSnap.id,
      })
    })
  })
})

type RenderOfferContentType = Partial<ComponentProps<typeof OfferContent>> & {
  isDesktopViewport?: boolean
}

function renderOfferContent({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
  isDesktopViewport,
  chronicles,
  videoData,
}: RenderOfferContentType) {
  const subtitle = 'Membre du Book Club'
  const chroniclesData =
    chronicles ||
    offer.chronicles.map((data) => chroniclePreviewToChronicalCardData(data, subtitle))
  render(
    reactQueryProviderHOC(
      <NavigationContainer>
        <OfferContent
          offer={offer}
          searchGroupList={subcategoriesDataTest.searchGroups}
          subcategory={subcategory}
          chronicles={chroniclesData}
          chronicleVariantInfo={chronicleVariantInfoFixture}
          videoData={videoData}
        />
      </NavigationContainer>
    ),
    {
      theme: { isDesktopViewport: isDesktopViewport ?? false },
    }
  )
}
