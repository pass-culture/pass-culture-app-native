import * as reactNavigationNative from '@react-navigation/native'
import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import { Platform } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { EMPTY_HOMEPAGE } from 'features/home/api/useHomepageData'
import {
  formattedVenuesModule,
  highlightHeaderFixture,
} from 'features/home/fixtures/homepage.fixture'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { useFetchHomepageByIdQuery } from 'features/home/queries/useGetHomepageQuery'
import { Color, Homepage, ThematicHeaderType } from 'features/home/types'
import * as useGoBack from 'features/navigation/useGoBack'
import * as useMapSubscriptionHomeIdsToThematic from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { SubscriptionTheme } from 'features/subscription/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { GeolocPermissionState } from 'libs/location/location'
import { LocationMode, UseLocationReturnType } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  locationSelectors,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { queryClient } from 'libs/react-query/queryClient'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

jest.mock('features/home/queries/useGetHomepageQuery')
const mockUseHomepageData = useFetchHomepageByIdQuery as jest.MockedFunction<
  typeof useFetchHomepageByIdQuery
>

const mockUseFetchHomepageByIdQueryValue: UseQueryResult<Homepage, Error> = {
  data: EMPTY_HOMEPAGE,
  isLoading: false,
  error: null,
  isSuccess: true,
  isError: false,
  refetch: jest.fn(),
  status: 'success',
  failureCount: 0,
  isFetched: true,
  isFetchedAfterMount: true,
  isFetching: false,
  isPending: false,
  isEnabled: false,
  isInitialLoading: false,
  isLoadingError: false,
  isPlaceholderData: false,
  isRefetchError: false,
  isStale: false,
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  errorUpdateCount: 0,
  isRefetching: false,
  failureReason: new Error(),
  isPaused: false,
  fetchStatus: 'fetching',
  promise: Promise.resolve(EMPTY_HOMEPAGE),
}

mockUseHomepageData.mockReturnValue(mockUseFetchHomepageByIdQueryValue)

const defaultUseLocation: Partial<UseLocationReturnType> = {
  userLocation: {
    latitude: 2,
    longitude: 2,
  },
  permissionState: GeolocPermissionState.GRANTED,
  setPlace: jest.fn(),
  setSelectedLocationMode: jest.fn(),
  onResetPlace: jest.fn(),
}
const mockUseLocation = jest.fn(() => defaultUseLocation)
jest.mock('libs/location/useLocation', () => ({
  useLocation: () => mockUseLocation(),
}))

jest
  .spyOn(useMapSubscriptionHomeIdsToThematic, 'useMapSubscriptionHomeIdsToThematic')
  .mockReturnValue(SubscriptionTheme.CINEMA)

jest.mock('features/profile/pages/NotificationSettings/usePushPermission', () => ({
  usePushPermission: jest.fn(() => ({
    pushPermission: 'granted',
  })),
}))

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

const modules = [formattedVenuesModule]

jest.mock('libs/firebase/analytics/analytics')

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
  push: jest.fn(),
})

jest.useFakeTimers()

const user = userEvent.setup()

const REVERSE_GEOCODE_URL = 'https://data.geopf.fr/geocodage/reverse'

describe('ThematicHome', () => {
  useRoute.mockReturnValue({ params: { entryId: 'fakeEntryId' } })

  mockUseHomepageData.mockReturnValue({
    ...mockUseFetchHomepageByIdQueryValue,
    data: {
      modules,
      id: 'fakeEntryId',
      thematicHeader: {
        title: 'HeaderTitle',
        subtitle: 'HeaderSubtitle',
        type: ThematicHeaderType.Category,
        imageUrl: 'url.com/image',
        color: Color.Lilac,
      },
      tags: [],
    },
  })

  beforeEach(() => {
    setFeatureFlags()
    useLocationV2.setState(defaultLocationState)
    locationActions.setGeolocPosition({ latitude: 2, longitude: 2 })
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should render correctly', async () => {
    renderThematicHome()

    await screen.findByText('Suivre')

    expect(screen).toMatchSnapshot()
  })

  describe('header', () => {
    it('should show highlight header when provided', async () => {
      mockUseHomepageData.mockReturnValueOnce({
        ...mockUseFetchHomepageByIdQueryValue,
        data: highlightHeaderFixture,
      })

      renderThematicHome()

      expect(await screen.findByText('Un sous-titre')).toBeOnTheScreen()
      expect(screen.getAllByText('Bloc temps fort')).not.toHaveLength(0)
    })

    it('should show highlight animated header when provided and platform is iOS', async () => {
      Platform.OS = 'ios'

      mockUseHomepageData.mockReturnValueOnce({
        ...mockUseFetchHomepageByIdQueryValue,
        data: highlightHeaderFixture,
      })

      renderThematicHome()

      expect(await screen.findAllByText('Bloc temps fort')).not.toHaveLength(0)
      expect(screen.getByTestId('animated-thematic-header')).toBeOnTheScreen()
    })

    it('should show highlight thematic introduction when provided and platform is iOS', async () => {
      Platform.OS = 'ios'

      const mockedHighlightHeaderDataWithIntroduction = {
        ...highlightHeaderFixture,
        thematicHeader: {
          ...highlightHeaderFixture.thematicHeader,
          introductionTitle: 'IntroductionTitle',
          introductionParagraph: 'IntroductionParagraph',
        },
      }
      mockUseHomepageData.mockReturnValueOnce({
        ...mockUseFetchHomepageByIdQueryValue,
        data: mockedHighlightHeaderDataWithIntroduction,
      })

      renderThematicHome()

      expect(await screen.findByText('IntroductionTitle')).toBeOnTheScreen()
      expect(screen.getByText('IntroductionParagraph')).toBeOnTheScreen()
    })

    it('should not show highlight animated header when provided and platform is Android', async () => {
      Platform.OS = 'android'

      mockUseHomepageData.mockReturnValueOnce({
        ...mockUseFetchHomepageByIdQueryValue,
        data: highlightHeaderFixture,
      })

      renderThematicHome()

      expect(await screen.findAllByText('Bloc temps fort')).not.toHaveLength(0)
      expect(screen.queryByTestId('animated-thematic-header-v1')).not.toBeOnTheScreen()
    })

    it('should show category header when provided', async () => {
      mockUseHomepageData.mockReturnValueOnce({
        ...mockUseFetchHomepageByIdQueryValue,
        data: {
          modules,
          tags: [],
          id: 'fakeEntryId',
          thematicHeader: {
            type: ThematicHeaderType.Category,
            subtitle: 'Un sous-titre',
            title: 'Catégorie cinéma',
            color: Color.Lilac,
          },
        },
      })

      renderThematicHome()

      expect(await screen.findAllByText('Catégorie cinéma')).not.toHaveLength(0)
      expect(screen.getByText('Un sous-titre')).toBeOnTheScreen()
    })

    it('should execute go back when pressing back button and url has chronicles from parameter', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          entryId: 'fakeEntryId',
          from: 'chronicles',
        },
      })
      renderThematicHome()

      await user.press(await screen.findByLabelText('Revenir en arrière'))

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })

    it('should execute go back when pressing back button and url has deeplink from parameter', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          entryId: 'fakeEntryId',
          from: 'deeplink',
        },
      })
      renderThematicHome()

      await user.press(await screen.findByLabelText('Revenir en arrière'))

      expect(mockNavigate).toHaveBeenCalledTimes(1)
    })

    it('should execute go back when pressing back button without from parameter', async () => {
      useRoute.mockReturnValueOnce({ params: { entryId: 'fakeEntryId' } })

      renderThematicHome()

      await user.press(await screen.findByLabelText('Revenir en arrière'))

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('analytics', () => {
    it('should log ConsultThematicHome', async () => {
      renderThematicHome()

      await screen.findByText('Suivre')

      expect(analytics.logConsultThematicHome).toHaveBeenNthCalledWith(1, {
        homeEntryId: 'fakeEntryId',
      })
    })

    it('should log ConsultThematicHome when coming from category block', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          entryId: 'fakeEntryId',
          from: 'category_block',
          moduleId: 'moduleId',
          moduleListId: 'moduleListId',
        },
      })
      renderThematicHome()

      await screen.findByText('Suivre')

      expect(analytics.logConsultThematicHome).toHaveBeenNthCalledWith(1, {
        homeEntryId: 'fakeEntryId',
        from: 'category_block',
        moduleId: 'moduleId',
        moduleListId: 'moduleListId',
      })
    })

    it('should log ConsultThematicHome when coming from highlight thematic block', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          entryId: 'fakeEntryId',
          from: 'highlight_thematic_block',
          moduleId: 'moduleId',
        },
      })
      renderThematicHome()
      await screen.findByText('Suivre')

      expect(analytics.logConsultThematicHome).toHaveBeenNthCalledWith(1, {
        homeEntryId: 'fakeEntryId',
        from: 'highlight_thematic_block',
        moduleId: 'moduleId',
      })
    })

    it('should log ConsultThematicHome when coming from deeplinks', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          from: 'deeplink',
        },
      })
      renderThematicHome()
      await screen.findByText('Suivre')

      expect(analytics.logConsultThematicHome).toHaveBeenNthCalledWith(1, {
        from: 'deeplink',
        homeEntryId: 'fakeEntryId',
        moduleId: undefined,
        moduleItemId: undefined,
        moduleListId: undefined,
      })
    })
  })

  it('should not show geolocation banner when user is geolocated or located', async () => {
    renderThematicHome()

    await screen.findByText('Suivre')

    expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
  })

  it('should show system banner when user is not geolocated or located', async () => {
    useLocationV2.setState(defaultLocationState)
    renderThematicHome()

    await screen.findByText('Suivre')

    expect(screen.getByTestId('systemBanner')).toBeOnTheScreen()
  })

  it('should not show system banner when user is geolocated or located', async () => {
    renderThematicHome()

    await screen.findByText('Suivre')

    expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
  })

  it('should set the location if present in url parameters', async () => {
    const latitude = 12
    const longitude = 14

    queryClient.clear()
    mockServer.universalGet(REVERSE_GEOCODE_URL, {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          properties: {
            type: 'locality',
            label: 'Lieu depuis URL',
          },
        },
      ],
    })
    useRoute.mockReturnValueOnce({
      params: { entryId: 'fakeEntryId', latitude, longitude },
    })
    renderThematicHome()

    await screen.findByText('Suivre')

    await waitFor(() => {
      expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)
    })

    expect(locationSelectors.selectLocationConfiguration(LocationMode.AROUND_PLACE)).toEqual(
      expect.objectContaining({
        geolocation: { latitude, longitude },
        label: 'Lieu depuis URL',
        type: 'locality',
        info: '',
      })
    )
  })
})

const renderThematicHome = () => {
  render(reactQueryProviderHOC(<ThematicHome />))
}
