import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'
import { Platform } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useHomepageData } from 'features/home/api/useHomepageData'
import {
  formattedVenuesModule,
  highlightHeaderFixture,
} from 'features/home/fixtures/homepage.fixture'
import { ThematicHome } from 'features/home/pages/ThematicHome'
import { Color, ThematicHeaderType } from 'features/home/types'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import * as useGoBack from 'features/navigation/useGoBack'
import * as useMapSubscriptionHomeIdsToThematic from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { SubscriptionTheme } from 'features/subscription/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { GeolocPermissionState, ILocationContext } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.MockedFunction<typeof useHomepageData>

const defaultUseLocation: Partial<ILocationContext> = {
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
jest.mock('libs/location/LocationWrapper', () => ({
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

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
  }),
}))

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

const modules = [formattedVenuesModule]

jest.mock('libs/firebase/analytics/analytics')

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

const user = userEvent.setup()

jest.useFakeTimers()

describe('ThematicHome', () => {
  useRoute.mockReturnValue({ params: { entryId: 'fakeEntryId' } })

  mockUseHomepageData.mockReturnValue({
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
  })

  beforeEach(() => {
    setFeatureFlags()
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should render correctly', async () => {
    renderThematicHome()

    await screen.findByText('Suivre')

    expect(screen).toMatchSnapshot()
  })

  describe('header', () => {
    it('should show highlight header when provided', async () => {
      mockUseHomepageData.mockReturnValueOnce(highlightHeaderFixture)

      renderThematicHome()

      expect(await screen.findByText('Un sous-titre')).toBeOnTheScreen()
      expect(screen.getAllByText('Bloc temps fort')).not.toHaveLength(0)
    })

    it('should show highlight animated header when provided and platform is iOS', async () => {
      Platform.OS = 'ios'

      mockUseHomepageData.mockReturnValueOnce(highlightHeaderFixture)

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
      mockUseHomepageData.mockReturnValueOnce(mockedHighlightHeaderDataWithIntroduction)

      renderThematicHome()

      expect(await screen.findByText('IntroductionTitle')).toBeOnTheScreen()
      expect(screen.getByText('IntroductionParagraph')).toBeOnTheScreen()
    })

    it('should not show highlight animated header when provided and platform is Android', async () => {
      Platform.OS = 'android'

      mockUseHomepageData.mockReturnValueOnce(highlightHeaderFixture)

      renderThematicHome()

      expect(await screen.findAllByText('Bloc temps fort')).not.toHaveLength(0)
      expect(screen.queryByTestId('animated-thematic-header-v1')).not.toBeOnTheScreen()
    })

    it('should show category header when provided', async () => {
      mockUseHomepageData.mockReturnValueOnce({
        modules,
        tags: [],
        id: 'fakeEntryId',
        thematicHeader: {
          type: ThematicHeaderType.Category,
          imageUrl:
            'https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg',
          subtitle: 'Un sous-titre',
          title: 'Catégorie cinéma',
          color: Color.Lilac,
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

    it('should navigate to home when pressing back button and url has not chronicles from parameter', async () => {
      useRoute.mockReturnValueOnce({
        params: {
          entryId: 'fakeEntryId',
          from: 'deeplink',
        },
      })
      renderThematicHome()

      await user.press(await screen.findByLabelText('Revenir en arrière'))

      expect(mockNavigate).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
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
    mockUseLocation.mockReturnValueOnce(defaultUseLocation)
    renderThematicHome()

    await screen.findByText('Suivre')

    expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
  })

  it('should show system banner when user is not geolocated or located', async () => {
    mockUseLocation.mockReturnValueOnce({
      ...defaultUseLocation,
      userLocation: undefined,
    })
    renderThematicHome()

    await screen.findByText('Suivre')

    expect(screen.getByTestId('systemBanner')).toBeOnTheScreen()
  })

  it('should not show system banner when user is geolocated or located', async () => {
    mockUseLocation.mockReturnValueOnce(defaultUseLocation)
    renderThematicHome()

    await screen.findByText('Suivre')

    expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
  })

  describe('localization', () => {
    it.each`
      hasGeolocPosition | from                | selectedLocationMode         | expectedLocationMode
      ${true}           | ${'deeplink'}       | ${LocationMode.AROUND_ME}    | ${LocationMode.AROUND_ME}
      ${true}           | ${'deeplink'}       | ${LocationMode.EVERYWHERE}   | ${LocationMode.AROUND_ME}
      ${true}           | ${'deeplink'}       | ${LocationMode.AROUND_PLACE} | ${LocationMode.AROUND_ME}
      ${true}           | ${'category_block'} | ${LocationMode.AROUND_ME}    | ${LocationMode.AROUND_ME}
      ${true}           | ${'category_block'} | ${LocationMode.EVERYWHERE}   | ${LocationMode.AROUND_ME}
      ${false}          | ${'deeplink'}       | ${LocationMode.EVERYWHERE}   | ${LocationMode.EVERYWHERE}
      ${false}          | ${'category_block'} | ${LocationMode.EVERYWHERE}   | ${LocationMode.EVERYWHERE}
      ${false}          | ${'deeplink'}       | ${LocationMode.AROUND_PLACE} | ${LocationMode.AROUND_PLACE}
      ${false}          | ${'category_block'} | ${LocationMode.AROUND_PLACE} | ${LocationMode.AROUND_PLACE}
      ${true}           | ${'category_block'} | ${LocationMode.AROUND_PLACE} | ${LocationMode.AROUND_PLACE}
    `(
      'should have localization mode $expectedLocationMode when user comes from $from, geolocPosition is $hasGeolocPosition and has $selectedLocationMode',
      async ({
        hasGeolocPosition,
        from,
        selectedLocationMode,
        expectedLocationMode,
      }: {
        hasGeolocPosition: boolean
        from: string
        selectedLocationMode: LocationMode
        expectedLocationMode: LocationMode
      }) => {
        useRoute.mockReturnValueOnce({ params: { entryId: 'fakeEntryId', from } })

        mockUseLocation.mockReturnValueOnce({
          ...defaultUseLocation,
          selectedLocationMode,
          hasGeolocPosition,
        })
        renderThematicHome()

        await screen.findByText('Suivre')

        expect(defaultUseLocation.setSelectedLocationMode).toHaveBeenCalledWith(
          expectedLocationMode
        )
      }
    )
  })
})

const renderThematicHome = () => {
  render(reactQueryProviderHOC(<ThematicHome />))
}
