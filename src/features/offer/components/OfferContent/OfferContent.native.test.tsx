import React, { ComponentProps } from 'react'
import { InViewProps } from 'react-native-intersection-observer'

import { navigate } from '__mocks__/@react-navigation/native'
import {
  NativeCategoryIdEnumv2,
  OfferResponseV2,
  RecommendationApiParams,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { PlaylistType } from 'features/offer/enums'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useSameArtistPlaylist from 'features/offer/helpers/useSameArtistPlaylist/useSameArtistPlaylist'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place/types'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { OfferContent } from './OfferContent'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.useFakeTimers()

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

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

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
  useRemoteConfigContext: jest.fn().mockReturnValue({
    sameAuthorPlaylist: 'withPlaylistAsFirst',
    reactionFakeDoorCategories: {
      categories: [
        'SEANCES_DE_CINEMA',
        'CD',
        'MUSIQUE_EN_LIGNE',
        'VINYLES',
        'LIVRES_AUDIO_PHYSIQUES',
        'LIVRES_NUMERIQUE_ET_AUDIO',
        'LIVRES_PAPIER',
        'DVD_BLU_RAY',
        'FILMS_SERIES_EN_LIGNE',
      ],
    },
  }),
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

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

describe('<OfferContent />', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockPosition = { latitude: 90.4773245, longitude: 90.4773245 }
    mockAuthContextWithoutUser({ persist: true })

    jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)
  })

  it('should display offer header', async () => {
    renderOfferContent({})

    expect(await screen.findByTestId('offerHeaderName')).toBeOnTheScreen()
  })

  describe('When WIP_OFFER_PREVIEW feature flag activated', () => {
    beforeEach(() => {
      jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)
    })

    it('should navigate to offer preview screen when clicking on image offer', async () => {
      renderOfferContent({})

      fireEvent.press(await screen.findByTestId('offerImageWithoutCarousel'))

      expect(navigate).toHaveBeenCalledWith('OfferPreview', { id: 116656, defaultIndex: 0 })
    })

    it('should not navigate to offer preview screen when clicking on image offer and there is not an image', async () => {
      const offer: OfferResponseV2 = {
        ...offerResponseSnap,
        images: null,
      }
      renderOfferContent({ offer })

      fireEvent.press(await screen.findByTestId('offerImageWithoutCarousel'))

      expect(navigate).not.toHaveBeenCalled()
    })
  })

  describe('When WIP_OFFER_PREVIEW feature flag deactivated', () => {
    beforeEach(() => {
      jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
    })

    it('should not navigate to offer preview screen when clicking on image offer', async () => {
      renderOfferContent({})

      fireEvent.press(await screen.findByTestId('offerImageWithoutCarousel'))

      expect(navigate).not.toHaveBeenCalled()
    })

    it('should not display linear gradient on offer image when enableOfferPreview feature flag deactivated', async () => {
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.queryByTestId('imageGradient')).not.toBeOnTheScreen()
    })

    it('should not display tag on offer image when enableOfferPreview feature flag deactivated', async () => {
      renderOfferContent({})

      await screen.findByText('Réserver l’offre')

      expect(screen.queryByTestId('imageTag')).not.toBeOnTheScreen()
    })
  })

  it('should animate on scroll', async () => {
    renderOfferContent({})

    await screen.findByText('Réserver l’offre')

    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(0)

    fireEvent.scroll(await screen.findByTestId('offerv2-container'), scrollEvent)

    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(1)
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

      expect(await screen.findByText('Réserver l’offre')).toBeOnTheScreen()
    })

    it('should log analytics when display authentication modal', async () => {
      renderOfferContent({})

      fireEvent.press(await screen.findByText('Réserver l’offre'))

      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })

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

  describe('Batch trigger', () => {
    it('should trigger has_seen_offer_for_survey event after 5 seconds', async () => {
      renderOfferContent({})

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      await screen.findByText('Réserver l’offre')

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event before 5 seconds have elapsed', async () => {
      renderOfferContent({})

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 1)
      })

      await screen.findByText('Réserver l’offre')

      expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event on scroll to bottom', async () => {
      renderOfferContent({})

      fireEvent.scroll(await screen.findByTestId('offerv2-container'), nativeEventBottom)

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event on scroll to middle', async () => {
      renderOfferContent({})

      fireEvent.scroll(await screen.findByTestId('offerv2-container'), nativeEventMiddle)

      expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event once on scroll to bottom and after 5 seconds', async () => {
      renderOfferContent({})

      fireEvent.scroll(await screen.findByTestId('offerv2-container'), nativeEventBottom)

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      expect(BatchUser.trackEvent).toHaveBeenCalledTimes(3) // Three different Batch events are triggered on this page
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOffer)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenCinemaOfferForSurvey)
    })

    it.each([
      NativeCategoryIdEnumv2.BIBLIOTHEQUE_MEDIATHEQUE,
      NativeCategoryIdEnumv2.CONCOURS,
      NativeCategoryIdEnumv2.MATERIELS_CREATIFS,
      NativeCategoryIdEnumv2.CARTES_JEUNES,
    ])(
      'should not trigger has_seen_offer_for_survey event for uneligible offer type %s',
      async (nativeCategoryId) => {
        renderOfferContent({ subcategory: { ...mockSubcategory, nativeCategoryId } })

        await act(async () => {
          jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
        })

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

        await act(async () => {
          jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
        })

        await screen.findByText('Réserver l’offre')

        expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
        expect(BatchUser.trackEvent).toHaveBeenCalledWith(expectedBatchEvent)
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
})

type RenderOfferContentType = Partial<ComponentProps<typeof OfferContent>> & {
  isDesktopViewport?: boolean
}

function renderOfferContent({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
  isDesktopViewport,
}: RenderOfferContentType) {
  render(
    reactQueryProviderHOC(
      <OfferContent
        offer={offer}
        searchGroupList={subcategoriesDataTest.searchGroups}
        subcategory={subcategory}
      />
    ),
    {
      theme: { isDesktopViewport: isDesktopViewport ?? false },
    }
  )
}
