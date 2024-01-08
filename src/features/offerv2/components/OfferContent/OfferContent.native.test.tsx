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
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import * as useSameArtistPlaylist from 'features/offer/components/OfferPlaylistOld/hook/useSameArtistPlaylist'
import { PlaylistType } from 'features/offer/enums'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Subcategory } from 'libs/subcategories/types'
import { RecommendationApiParams } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

import { OfferContent } from './OfferContent'

const mockSubcategory: Subcategory = {
  categoryId: CategoryIdEnum.CINEMA,
  appLabel: 'Cinéma plein air',
  searchGroupName: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
  homepageLabelName: HomepageLabelNameEnumv2.CINEMA,
  isEvent: true,
  onlineOfflinePlatform: OnlineOfflinePlatformChoicesEnumv2.OFFLINE,
  nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
}

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
  .mockImplementation()
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

const mockRefetchSameArtistPlaylist = jest.fn()
jest.spyOn(useSameArtistPlaylist, 'useSameArtistPlaylist').mockReturnValue({
  sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
  refetchSameArtistPlaylist: mockRefetchSameArtistPlaylist,
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

describe('<OfferContent />', () => {
  beforeEach(() => {
    mockServer.getApiV1<SubcategoriesResponseModelv2>('/subcategories/v2', placeholderData)
    mockPosition = { latitude: 90.4773245, longitude: 90.4773245 }
  })

  it('should display offer as a title', async () => {
    renderOfferContent({})

    await act(async () => {})

    expect(screen.getByText('Sous les étoiles de Paris - VF')).toBeOnTheScreen()
  })

  it('should display tags', async () => {
    renderOfferContent({})

    await act(async () => {})

    expect(screen.getByText('Cinéma plein air')).toBeOnTheScreen()
  })

  it('should display vinyl offer tags', async () => {
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

    await act(async () => {})

    expect(screen.getByText('Metal')).toBeOnTheScreen()
    expect(screen.getByText('Industrial')).toBeOnTheScreen()
    expect(screen.getByText('Vinyles et autres supports')).toBeOnTheScreen()
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

    await act(async () => {})

    expect(screen.getByText('de Marion Cotillard, Leonardo DiCaprio')).toBeOnTheScreen()
  })

  it('should display prices', async () => {
    renderOfferContent({})

    await act(async () => {})

    expect(screen.getByText('5,00 €')).toBeOnTheScreen()
  })

  it('should display venue section', async () => {
    renderOfferContent({})

    await act(async () => {})

    expect(screen.getByText('Copier l’adresse')).toBeOnTheScreen()
  })

  it('should display venue tag distance when user share his position', async () => {
    renderOfferContent({})

    await act(async () => {})

    expect(screen.getByText('à 900+ km')).toBeOnTheScreen()
  })

  it('should not display venue tag distance when user not share his position', async () => {
    mockPosition = null
    renderOfferContent({})

    await act(async () => {})

    expect(screen.queryByText('à 900+ km')).not.toBeOnTheScreen()
  })

  describe('With same artist playlist', () => {
    const extraData = {
      author: 'Eiichiro Oda',
      ean: '9782723492607',
    }

    it('should display same artist playlist', async () => {
      renderOfferContent({ offer: { ...offerResponseSnap, extraData } })

      await act(async () => {})

      expect(screen.getByText('Du même auteur')).toBeOnTheScreen()
    })

    it('should call refetch when artist and EAN are provided because playlist not refresh correctly when navigate to an other offer', async () => {
      renderOfferContent({ offer: { ...offerResponseSnap, extraData } })

      await act(async () => {})

      expect(mockRefetchSameArtistPlaylist).toHaveBeenCalledTimes(1)
    })

    it('should not call refetch when artist and EAN are not provided', async () => {
      renderOfferContent({})

      await act(async () => {})

      expect(mockRefetchSameArtistPlaylist).not.toHaveBeenCalled()
    })

    it('should trigger logSameArtistPlaylistVerticalScroll when scrolling to the playlist', async () => {
      renderOfferContent({})

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
      renderOfferContent({})

      await act(async () => {})

      mockInView(true)
      mockInView(false)
      mockInView(true)

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
    })

    it('should not trigger logSameArtistPlaylistVerticalScroll when not scrolling to the playlist', async () => {
      renderOfferContent({})

      await act(async () => {})

      mockInView(false)

      expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalled()
    })
  })

  describe('With same category similar offers', () => {
    it('should display same category similar offers', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      renderOfferContent({})

      await act(async () => {})

      expect(screen.getByText('Dans la même catégorie')).toBeOnTheScreen()
    })

    it('should trigger logSameCategoryPlaylistVerticalScroll when scrolling to the playlist', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      renderOfferContent({})

      await act(async () => {})

      mockInView(true)

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

      await act(async () => {})

      mockInView(true)
      mockInView(false)
      mockInView(true)

      expect(analytics.logPlaylistVerticalScroll).toHaveBeenCalledTimes(1)
    })

    it('should not trigger logSameCategoryPlaylistVerticalScroll when not scrolling to the playlist', async () => {
      useSimilarOffersSpy.mockReturnValueOnce({
        similarOffers: mockedAlgoliaResponse.hits,
        apiRecoParams,
      })
      renderOfferContent({})

      await act(async () => {})

      mockInView(false)

      expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalled()
    })
  })

  describe('With other categories similar offers', () => {
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

      await act(async () => {})

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

      await act(async () => {})

      mockInView(true)

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

      await act(async () => {})

      mockInView(true)
      mockInView(false)
      mockInView(true)

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

      await act(async () => {})

      mockInView(false)

      expect(analytics.logPlaylistVerticalScroll).not.toHaveBeenCalled()
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
