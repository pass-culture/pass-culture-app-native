import mockdate from 'mockdate'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { push } from '__mocks__/@react-navigation/native'
import * as useAlgoliaRecommendedOffers from 'features/home/api/useAlgoliaRecommendedOffers'
import { OffersModuleParameters } from 'features/home/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { ThemeProvider } from 'libs/styled'
import { Offer } from 'shared/offer/types'
import { computedTheme } from 'tests/computedTheme'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { OffersModule, OffersModuleProps } from './OffersModule'

mockdate.set(new Date(2020, 10, 16))

const mockHitsItems: Offer[] = [mockedAlgoliaResponse.hits[0], mockedAlgoliaResponse.hits[1]]
const mockRecommendationOffers: Offer[] = [mockedAlgoliaResponse.hits[2]]
const mockNbHits = mockHitsItems.length
const mockData = {
  playlistItems: mockHitsItems,
  nbPlaylistResults: mockNbHits,
  moduleId: 'fakeModuleId',
}

const props = {
  offersModuleParameters: [{} as OffersModuleParameters],
  displayParameters: {
    minOffers: 0,
    title: 'Module title',
    layout: 'one-item-medium',
  } as DisplayParametersFields,
  moduleId: 'fakeModuleId',
  position: null,
  homeEntryId: 'fakeEntryId',
  index: 1,
  data: mockData,
}

const mockUseAlgoliaRecommendedOffers = jest
  .spyOn(useAlgoliaRecommendedOffers, 'useAlgoliaRecommendedOffers')
  .mockReturnValue(mockRecommendationOffers)

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/subcategories/useSubcategories')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

describe('OffersModule', () => {
  it('should not render if data is undefined', () => {
    renderOffersModule({ data: undefined })

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })

  it('should render hybrid playlist if recommended parameters', async () => {
    mockUseAlgoliaRecommendedOffers.mockReturnValueOnce(mockRecommendationOffers)
    renderOffersModule({
      recommendationParameters: { categories: ['Cinéma'] },
    })

    expect(await screen.findByText('Un lit sous une rivière')).toBeOnTheScreen()
  })

  it('should not render hybrid playlist if no recommended parameters', async () => {
    renderOffersModule({ recommendationParameters: undefined })

    expect(screen.queryByText('Un lit sous une rivière')).not.toBeOnTheScreen()
  })

  it('should trigger navigate with correct params when we click on See More', async () => {
    renderOffersModule({
      data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
    })

    await act(() => {
      fireEvent.press(screen.getByText('En voir plus'))
    })

    expect(push).toHaveBeenCalledWith('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: {
        screen: 'SearchResults',
        params: {
          beginningDatetime: undefined,
          date: null,
          endingDatetime: undefined,
          hitsPerPage: 20,
          isDigital: false,
          locationParams: {
            aroundMeRadius: 'all',
            aroundPlaceRadius: 'all',
            selectedLocationMode: 'EVERYWHERE',
            userLocation: undefined,
          },
          minBookingsThreshold: 0,
          offerCategories: [],
          offerGenreTypes: [],
          offerIsDuo: false,
          offerSubcategories: [],
          priceRange: [0, 300],
          query: '',
          tags: [],
          timeRange: null,
        },
      },
    })
  })

  describe('Analytics', () => {
    it('should trigger logEvent "AllTilesSeen" only once', async () => {
      renderOffersModule()
      const scrollView = screen.getByTestId('offersModuleList')

      await act(async () => {
        // 1st scroll to last item => trigger
        await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      })

      expect(analytics.logAllTilesSeen).toHaveBeenCalledWith({
        apiRecoParams: undefined,
        moduleName: props.displayParameters.title,
        numberOfTiles: mockNbHits,
      })
      expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)

      await act(async () => {
        await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      })

      expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)
    })

    it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', () => {
      renderOffersModule()

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
        call_id: undefined,
        hybridModuleOffsetIndex: undefined,
        moduleId: props.moduleId,
        moduleType: ContentTypes.ALGOLIA,
        index: props.index,
        homeEntryId: props.homeEntryId,
        offers: ['102280', '102272'],
      })
    })

    it('should not trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', () => {
      mockUseAlgoliaRecommendedOffers.mockReturnValueOnce(mockRecommendationOffers)

      renderOffersModule({
        offersModuleParameters: [{ title: 'Search title' } as OffersModuleParameters],
        displayParameters: { ...props.displayParameters, minOffers: mockNbHits + 1 },
      })

      expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
    })

    it('should trigger logEvent "SeeMoreHasBeenClicked" when we click on See More', async () => {
      renderOffersModule({
        data: { playlistItems: mockHitsItems, nbPlaylistResults: 10, moduleId: 'fakeModuleId' },
      })

      await act(() => {
        fireEvent.press(screen.getByText('En voir plus'))
      })

      expect(analytics.logClickSeeMore).toHaveBeenCalledWith({
        moduleId: 'fakeModuleId',
        moduleName: 'Module title',
      })
    })

    it('should trigger logEvent "ModuleDisplayedOnHomepage" with hybrid module type', () => {
      mockUseAlgoliaRecommendedOffers.mockReturnValueOnce(mockRecommendationOffers)

      renderOffersModule({ recommendationParameters: { categories: ['Cinéma'] } })

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
        call_id: undefined,
        moduleId: props.moduleId,
        moduleType: ContentTypes.HYBRID,
        index: props.index,
        homeEntryId: props.homeEntryId,
        hybridModuleOffsetIndex: 2,
        offers: ['102280', '102272', '102249'],
      })
    })

    it('should trigger logEvent "ModuleDisplayedOnHomepage" with hybridModuleOffsetIndex equal to one when playlist is only recommendedOffers', () => {
      mockUseAlgoliaRecommendedOffers.mockReturnValueOnce(mockRecommendationOffers)
      renderOffersModule({
        data: { playlistItems: [], nbPlaylistResults: mockNbHits, moduleId: 'fakeModuleId' },
        recommendationParameters: { categories: ['Cinéma'] },
      })

      expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
        call_id: undefined,
        moduleId: props.moduleId,
        moduleType: ContentTypes.HYBRID,
        index: props.index,
        homeEntryId: props.homeEntryId,
        hybridModuleOffsetIndex: 1,
        offers: ['102249'],
      })
    })
  })
})

const renderOffersModule = (additionalProps: Partial<OffersModuleProps> = {}) =>
  render(
    reactQueryProviderHOC(
      <ThemeProvider theme={computedTheme}>
        <OffersModule {...props} {...additionalProps} />
      </ThemeProvider>
    )
  )
