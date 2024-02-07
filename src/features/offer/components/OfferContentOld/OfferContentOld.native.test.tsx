import React from 'react'
import { InViewProps } from 'react-native-intersection-observer'

import { useRoute } from '__mocks__/@react-navigation/native'
import {
  NativeCategoryIdEnumv2,
  OfferResponse,
  SearchGroupNameEnumv2,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { OfferContentOld } from 'features/offer/components/OfferContentOld/OfferContentOld'
import * as useSameArtistPlaylist from 'features/offer/components/OfferPlaylistOld/hook/useSameArtistPlaylist'
import { PlaylistType } from 'features/offer/enums'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { offerId } from 'features/offer/helpers/renderOfferPageTestUtil'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { RecommendationApiParams } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const useSimilarOffersSpy = jest
  .spyOn(useSimilarOffers, 'useSimilarOffers')
  .mockImplementation()
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

jest.spyOn(useSameArtistPlaylist, 'useSameArtistPlaylist').mockReturnValue({
  sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
})

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

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

const apiRecoParams: RecommendationApiParams = {
  call_id: '1',
  filtered: true,
  geo_located: false,
  model_endpoint: 'default',
  model_name: 'similar_offers_default_prod',
  model_version: 'similar_offers_clicks_v2_1_prod_v_20230317T173445',
  reco_origin: 'default',
}

const scrollEvent = {
  nativeEvent: {
    contentOffset: { y: 200 },
    layoutMeasurement: { height: 1000 },
    contentSize: { height: 1900 },
  },
}

const nativeEventTop = {
  nativeEvent: {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 100 },
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

describe('<OfferContentOld />', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    mockServer.getApiV1<OfferResponse>(`/offer/${offerResponseSnap.id}`, offerResponseSnap)
    mockServer.getApiV1<SubcategoriesResponseModelv2>('/subcategories/v2', placeholderData)
  })

  it('animates on scroll', async () => {
    renderOfferContentOld({})

    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(0)

    await act(async () => {
      const scrollContainer = screen.getByTestId('offer-container')
      fireEvent.scroll(scrollContainer, scrollEvent)
    })

    expect(screen.getByTestId('offerHeaderName').props.style.opacity).toBe(1)
  })

  it('should log analytics when display authentication modal', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))

    renderOfferContentOld({})

    const bookingOfferButton = await screen.findByText('Réserver l’offre')
    await act(async () => {
      fireEvent.press(bookingOfferButton)
    })

    expect(analytics.logConsultAuthenticationModal).toHaveBeenNthCalledWith(1, offerId)
  })

  describe('With similar offers', () => {
    it('should log two logPlaylistVerticalScroll events when scrolling vertical and reaching the bottom when there are 2 playlists', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })

      renderOfferContentOld({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
        ...apiRecoParams,
        fromOfferId: undefined,
        offerId: 116656,
        playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        nbResults: 4,
      })
      expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(2, {
        ...apiRecoParams,
        fromOfferId: undefined,
        offerId: 116656,
        playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
        nbResults: 4,
      })
    })

    it('should not log two logPlaylistVerticalScroll events when scrolling vertical and reaching the bottom when playlist are empty', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({ similarOffers: [], apiRecoParams })
      useSimilarOffersSpy.mockReturnValueOnce({ similarOffers: [], apiRecoParams })
      renderOfferContentOld({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(1, {
        ...apiRecoParams,
        fromOfferId: undefined,
        offerId: 116656,
        playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      })
      expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenNthCalledWith(2, {
        ...apiRecoParams,
        fromOfferId: undefined,
        offerId: 116656,
        playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      })
    })

    it('should trigger logConsultWholeOffer when scrolling to the bottom of the component', async () => {
      renderOfferContentOld({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logConsultWholeOffer).toHaveBeenNthCalledWith(1, offerId)
    })

    it('should trigger logConsultWholeOffer only once when scrolling to the bottom of the component', async () => {
      renderOfferContentOld({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logConsultWholeOffer).toHaveBeenCalledTimes(1)

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logConsultWholeOffer).toHaveBeenCalledTimes(1)
    })

    describe('When there is only same category similar offers playlist', () => {
      beforeAll(() => {
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
        useSimilarOffersSpy.mockReturnValueOnce({ similarOffers: [], apiRecoParams })
      })

      it('should log logPlaylistVerticalScroll event with same category similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        renderOfferContentOld({})
        const scrollView = screen.getByTestId('offer-container')

        await act(async () => {
          fireEvent.scroll(scrollView, nativeEventBottom)
        })

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
          ...apiRecoParams,
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
          nbResults: 4,
        })
      })

      it('should not log logPlaylistVerticalScroll event with other categories similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        renderOfferContentOld({})
        const scrollView = screen.getByTestId('offer-container')

        await act(async () => {
          fireEvent.scroll(scrollView, nativeEventBottom)
        })

        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalledWith({
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
        })
      })
    })

    describe('When there is only other categories similar offers playlist', () => {
      beforeAll(() => {
        useSimilarOffersSpy.mockReturnValueOnce({ similarOffers: [], apiRecoParams })
        useSimilarOffersSpy.mockReturnValueOnce({
          similarOffers: mockedAlgoliaResponse.hits,
          apiRecoParams,
        })
      })

      it('should log logPlaylistVerticalScroll event with other categories similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        renderOfferContentOld({})
        const scrollView = screen.getByTestId('offer-container')

        await act(async () => {
          fireEvent.scroll(scrollView, nativeEventBottom)
        })

        expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
          ...apiRecoParams,
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
          nbResults: 4,
        })
      })

      it('should not log logPlaylistVerticalScroll event with same category similar offers playlist param when scrolling vertical and reaching the bottom', async () => {
        renderOfferContentOld({})
        const scrollView = screen.getByTestId('offer-container')

        await act(async () => {
          fireEvent.scroll(scrollView, nativeEventBottom)
        })

        expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalledWith({
          fromOfferId: undefined,
          offerId: 116656,
          playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        })
      })
    })

    it('should not log logPlaylistVerticalScroll event when scrolling vertical and not reaching the bottom', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      renderOfferContentOld({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventTop)
      })

      expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalled()
    })

    it('should log logPlaylistVerticalScroll with the event param fromOfferId & offerId', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      const fromOfferId = 1
      useRoute.mockReturnValueOnce({ params: { fromOfferId } })
      const offerId = 116656
      renderOfferContentOld({})
      const scrollView = screen.getByTestId('offer-container')

      await act(async () => {
        fireEvent.scroll(scrollView, nativeEventBottom)
      })

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
        ...apiRecoParams,
        fromOfferId,
        offerId,
        playlistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
        nbResults: 4,
      })
      expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(2, {
        ...apiRecoParams,
        fromOfferId,
        offerId,
        playlistType: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
        nbResults: 4,
      })
    })
  })

  describe('With same artist playlist', () => {
    it('should trigger logSameArtistPlaylistVerticalScroll when scrolling to the playlist', async () => {
      renderOfferContentOld({})

      await act(async () => {})

      mockInView(true)

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenNthCalledWith(1, {
        fromOfferId: undefined,
        offerId: 116656,
        playlistType: PlaylistType.SAME_ARTIST_PLAYLIST,
        nbResults: 30,
      })
    })

    it('should trigger only once time logSameArtistPlaylistVerticalScroll when scrolling to the playlist', async () => {
      renderOfferContentOld({})

      await act(async () => {})

      mockInView(true)
      mockInView(false)
      mockInView(true)

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
    })

    it('should not trigger logSameArtistPlaylistVerticalScroll when not scrolling to the playlist', async () => {
      renderOfferContentOld({})

      await act(async () => {})

      mockInView(false)

      expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalled()
    })
  })

  it('should trigger logEvent "ConsultAllOffer" when reaching the end', async () => {
    renderOfferContentOld({})
    const scrollView = screen.getByTestId('offer-container')

    await act(async () => {
      fireEvent.scroll(scrollView, nativeEventMiddle)
    })

    expect(analytics.logConsultWholeOffer).not.toHaveBeenCalled()

    await act(async () => {
      fireEvent.scroll(scrollView, nativeEventBottom)
    })

    expect(analytics.logConsultWholeOffer).toHaveBeenCalledWith(offerId)
  })

  it('should trigger logEvent "ConsultAllOffer" only once', async () => {
    renderOfferContentOld({})
    const scrollView = screen.getByTestId('offer-container')
    await act(async () => {
      fireEvent.scroll(scrollView, nativeEventBottom)
    })

    expect(analytics.logConsultWholeOffer).toHaveBeenCalledTimes(1)

    await act(async () => {
      fireEvent.scroll(scrollView, nativeEventMiddle)
      fireEvent.scroll(scrollView, nativeEventBottom)
    })

    expect(analytics.logConsultWholeOffer).toHaveBeenCalledTimes(1)
  })

  describe('Batch trigger', () => {
    it('should trigger has_seen_offer_for_survey event after 5 seconds', async () => {
      renderOfferContentOld({})

      await act(() => {})
      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event before 5 seconds have elapsed', async () => {
      renderOfferContentOld({})

      await act(() => {})
      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 1)

      expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event on scroll to bottom', async () => {
      renderOfferContentOld({})

      await act(() => {})
      fireEvent.scroll(screen.getByTestId('offer-container'), nativeEventBottom)

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should not trigger has_seen_offer_for_survey event on scroll to middle', async () => {
      renderOfferContentOld({})

      await act(() => {})
      fireEvent.scroll(screen.getByTestId('offer-container'), nativeEventMiddle)

      expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
    })

    it('should trigger has_seen_offer_for_survey event once on scroll to bottom and after 5 seconds', async () => {
      renderOfferContentOld({})

      await act(() => {})
      fireEvent.scroll(screen.getByTestId('offer-container'), nativeEventBottom)
      jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

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
      async (offerNativeCategory) => {
        renderOfferContentOld({ offerNativeCategory })

        await act(() => {})
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

        expect(BatchUser.trackEvent).not.toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
      }
    )

    it.each`
      offerNativeCategory                           | expectedBatchEvent
      ${NativeCategoryIdEnumv2.SEANCES_DE_CINEMA}   | ${BatchEvent.hasSeenCinemaOfferForSurvey}
      ${NativeCategoryIdEnumv2.VISITES_CULTURELLES} | ${BatchEvent.hasSeenCulturalVisitForSurvey}
      ${NativeCategoryIdEnumv2.LIVRES_PAPIER}       | ${BatchEvent.hasSeenBookOfferForSurvey}
      ${NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS} | ${BatchEvent.hasSeenConcertForSurvey}
    `(
      'should trigger has_seen_offer_for_survey and specific batch event for offer type $offerNativeCategory',
      async ({ offerNativeCategory, expectedBatchEvent }) => {
        renderOfferContentOld({ offerNativeCategory })

        await act(() => {})
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)

        expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
        expect(BatchUser.trackEvent).toHaveBeenCalledWith(expectedBatchEvent)
      }
    )
  })
})

type RenderOfferContentOldType = {
  offer?: OfferResponse
  offerNativeCategory?: NativeCategoryIdEnumv2
  offerSearchGroup?: SearchGroupNameEnumv2
}

function renderOfferContentOld({
  offer = offerResponseSnap,
  offerNativeCategory = NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
  offerSearchGroup = SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
}: RenderOfferContentOldType) {
  render(
    reactQueryProviderHOC(
      <OfferContentOld
        offer={offer}
        offerNativeCategory={offerNativeCategory}
        offerSearchGroup={offerSearchGroup}
        searchGroupList={placeholderData.searchGroups}
        subcategory={mockSubcategory}
      />
    )
  )
}
