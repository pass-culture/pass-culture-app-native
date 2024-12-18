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
import * as useMapSubscriptionHomeIdsToThematic from 'features/subscription/helpers/useMapSubscriptionHomeIdsToThematic'
import { SubscriptionTheme } from 'features/subscription/types'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState, ILocationContext } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

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
  })

  describe('analytics', () => {
    it('should log ConsultHome', async () => {
      renderThematicHome()

      await screen.findByText('Suivre')

      expect(analytics.logConsultThematicHome).toHaveBeenNthCalledWith(1, {
        homeEntryId: 'fakeEntryId',
      })
    })

    it('should log ConsultHome when coming from category block', async () => {
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

    it('should log ConsultHome when coming from highlight thematic block', async () => {
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
  })

  describe('geolocation banner when wipAppV2SystemBlock disabled', () => {
    // TODO(PC-33663): the tests of this describe block pass with and without the FF. The tests should be re-written.
    beforeAll(() => {
      setFeatureFlags()
    })

    it('should show geolocation banner when user is not geolocated or located', async () => {
      mockUseLocation.mockReturnValueOnce({
        ...defaultUseLocation,
        userLocation: undefined,
      })
      renderThematicHome()

      await screen.findByText('Suivre')

      expect(screen.getByTestId('genericBanner')).toBeOnTheScreen()
    })

    it('should not show geolocation banner when user is geolocated or located', async () => {
      mockUseLocation.mockReturnValueOnce(defaultUseLocation)
      renderThematicHome()

      await screen.findByText('Suivre')

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })
  })

  describe('system banner when wipAppV2SystemBlock enabled', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK])
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
  })

  describe('localization', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_SYSTEM_BLOCK])
    })

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
