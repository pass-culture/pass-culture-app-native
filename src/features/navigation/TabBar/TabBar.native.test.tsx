import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native'
import React from 'react'

import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import {
  DEFAULT_TAB_ROUTES,
  useTabNavigationContext,
} from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationFilter } from 'features/search/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { ThemeProvider } from 'libs/styled'
import { ColorSchemeEnum } from 'libs/styled/useColorScheme'
import { computedTheme } from 'tests/computedTheme'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen } from 'tests/utils'

import { TabBar } from './TabBar'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/navigation/TabBar/TabNavigationStateContext', () => {
  const { DEFAULT_TAB_ROUTES } = jest.requireActual(
    'features/navigation/TabBar/TabNavigationStateContext'
  )
  return { DEFAULT_TAB_ROUTES, useTabNavigationContext: jest.fn() }
})
const mockedUseTabNavigationContext = jest.mocked(useTabNavigationContext)

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 10 })),
}))

jest.mock('features/navigation/RootNavigator/rootRoutes', () => ({
  routes: [
    {
      name: 'TabNavigator',
      component: () => null,
      pathConfig: {
        initialRouteName: 'Home',
        screens: {
          Home: undefined,
          Search: undefined,
          Bookings: undefined,
          Favorites: undefined,
          Profile: undefined,
        },
      },
    },
  ],
}))

jest.mock('features/navigation/helpers/useTabBarItemBadges')
const mockUseTabBarItemBadges = useTabBarItemBadges as jest.Mock

const mockTabNavigationState: TabNavigationState<ParamListBase> = {
  history: [{ key: 'Home-LzN9F8ePccY3NzxcsunpQ', type: 'route' }],
  stale: false,
  type: 'tab',
  key: 'tab-oMaiLEoOIhNl7W4ZcsYSD',
  index: 0,
  routeNames: ['Home', '_DeeplinkOnlyHome1'],
  routes: [
    { name: 'Home', key: 'Home-LzN9F8ePccY3NzxcsunpQ', params: undefined },

    {
      name: '_DeeplinkOnlyHome1',
      key: '_DeeplinkOnlyHome1-DpjmCP7zfgwe2hAN76PJM',
      params: undefined,
    },
  ],
}

const navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> = {
  // @ts-expect-error : ignore type of emit to facilitate testing
  emit: jest.fn(() => ({ defaultPrevented: false })),
  navigate: jest.fn(),
  setParams: jest.fn(),
}

const mockDefaultLocationFilter: LocationFilter = {
  locationType: LocationMode.EVERYWHERE,
}

const mockAroundMeLocationFilter: LocationFilter = {
  locationType: LocationMode.AROUND_ME,
  aroundRadius: 50,
}

let mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
    hideSuggestions: jest.fn(),
  }),
}))

const mockDisabilities = {
  [DisplayedDisabilitiesEnum.AUDIO]: false,
  [DisplayedDisabilitiesEnum.MENTAL]: false,
  [DisplayedDisabilitiesEnum.MOTOR]: false,
  [DisplayedDisabilitiesEnum.VISUAL]: false,
}

const mockAccessibilityState = mockDisabilities
const mockSetDisabilities = jest.fn()
jest.mock('features/accessibility/context/AccessibilityFiltersWrapper', () => ({
  useAccessibilityFiltersContext: () => ({
    disabilities: mockAccessibilityState,
    setDisabilities: mockSetDisabilities,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('TabBar', () => {
  beforeEach(() => {
    mockedUseTabNavigationContext.mockReturnValue({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Home',
      })),
    })
    mockSearchState = {
      ...initialSearchState,
      locationFilter: mockDefaultLocationFilter,
    }
    setFeatureFlags()
  })

  beforeAll(() => {
    mockUseTabBarItemBadges.mockReturnValue({
      Bookings: 999,
    })
  })

  it('render correctly when FF is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    renderTabBar(mockTabNavigationState)

    expect(await screen.findByText('99+')).toBeOnTheScreen()
  })

  it('should display the 5 following tabs with Home selected', async () => {
    renderTabBar(mockTabNavigationState)

    const expectedTabsTestIds = [
      'Accueil sélectionné',
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Mes favoris',
      'Mon profil',
    ].sort()

    expectedTabsTestIds.forEach((tab) => {
      expect(screen.getByTestId(tab)).toBeOnTheScreen()
    })
  })

  it('should display the 5 following tabs with Bookings selected', () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Bookings',
      })),
    })
    renderTabBar(mockTabNavigationState)
    const expectedTabsTestIds = [
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Mes réservations sélectionné',
      'Mes favoris',
      'Mon profil',
    ].sort()

    expectedTabsTestIds.forEach((tab) => {
      expect(screen.getByTestId(tab)).toBeOnTheScreen()
    })
  })

  it('displays only one selected at a time', () => {
    renderTabBar(mockTabNavigationState)

    expect(screen.queryAllByTestId(/sélectionné/)).toHaveLength(1)
  })

  it('should navigate again to Profil tab on click Profil tab icon when Profil tab is already selected', async () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Profile',
      })),
    })
    renderTabBar(mockTabNavigationState)

    expect(screen.getByTestId('Mon profil sélectionné')).toBeOnTheScreen()

    const profileTab = screen.getByTestId('Mon profil')
    await user.press(profileTab)

    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('should navigate again to Home tab on click Home tab icon when Home tab is already selected', async () => {
    renderTabBar(mockTabNavigationState)

    expect(screen.getByTestId('Accueil sélectionné')).toBeOnTheScreen()

    const homeTab = screen.getByTestId('Accueil')
    await user.press(homeTab)

    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('should reset Search navigation params when clicked on selected Search tab', async () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'SearchStackNavigator',
      })),
    })
    renderTabBar(mockTabNavigationState)

    screen.getByTestId('Rechercher des offres sélectionné')

    const searchTab = screen.getByTestId('Rechercher des offres')
    await user.press(searchTab)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_STATE', payload: initialSearchState })
  })

  it('should reset Search accessibility navigation params when clicked on selected Search tab', async () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'SearchStackNavigator',
      })),
    })
    renderTabBar(mockTabNavigationState)

    screen.getByTestId('Rechercher des offres sélectionné')

    const searchTab = screen.getByTestId('Rechercher des offres')
    await user.press(searchTab)

    expect(mockSetDisabilities).toHaveBeenCalledWith(undefined)
  })

  it('navigates to Profile on Profile tab click', async () => {
    renderTabBar(mockTabNavigationState)
    const profileTab = screen.getByTestId('Mon profil')

    await user.press(profileTab)

    expect(navigation.navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'Profile',
      params: undefined,
    })
  })

  it('should call navigate with searchState params on press "Recherche"', async () => {
    renderTabBar(mockTabNavigationState)
    const searchButton = screen.getByText('Recherche')
    await user.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('SearchStackNavigator', {
        screen: 'SearchLanding',
        params: { ...initialSearchState, accessibilityFilter: mockAccessibilityState },
      })
    )
  })

  it('should not reset locationFilter on press "Recherche"', async () => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: mockAroundMeLocationFilter,
    }
    renderTabBar(mockTabNavigationState)
    const searchButton = screen.getByText('Recherche')
    await user.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('SearchStackNavigator', {
        screen: 'SearchLanding',
        params: {
          ...initialSearchState,
          accessibilityFilter: mockAccessibilityState,
          locationFilter: mockAroundMeLocationFilter,
        },
      })
    )
  })

  it('should return `SearchLanding` when there is less than 1 route in routes state', async () => {
    renderTabBar({
      ...mockTabNavigationState,
      routeNames: ['SearchLanding'],
      routes: [{ name: 'SearchLanding', key: '', params: undefined }],
    })

    const searchButton = screen.getByText('Recherche')
    await user.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('SearchStackNavigator', {
        screen: 'SearchLanding',
        params: {
          ...initialSearchState,
          accessibilityFilter: mockAccessibilityState,
        },
      })
    )
  })

  it('should return last visited route when there is more than 1 route in routes state', async () => {
    const routes = [
      {
        screen: 'SearchLanding',
        key: 'SearchLanding-NKQnogZCniOoY0bM3fe1c',
        name: 'SearchLanding',
        params: { screen: 'SearchLanding' },
      },
      {
        screen: 'ThematicSearch',
        key: 'ThematicSearch-X8VXvOMAWRm3n0SOvktHX',
        name: 'ThematicSearch',
        params: { screen: 'ThematicSearch' },
        path: undefined,
      },
    ]

    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: false,
        state: {
          routes,
        },
      })),
    })

    renderTabBar({
      ...mockTabNavigationState,
      routeNames: ['SearchLanding, ThematicSearch'],
      routes,
    })

    const searchButton = screen.getByText('Recherche')
    await user.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: {
          ...initialSearchState,
          accessibilityFilter: mockAccessibilityState,
        },
        screen: {
          ...routes[1],
          screen: 'ThematicSearch',
        },
      },
      screen: 'SearchStackNavigator',
    })
  })
})

function renderTabBar(tabNavigationState: TabNavigationState<ParamListBase>) {
  render(
    reactQueryProviderHOC(
      <ThemeProvider theme={computedTheme} colorScheme={ColorSchemeEnum.LIGHT}>
        <TabBar navigation={navigation} state={tabNavigationState} />
      </ThemeProvider>
    )
  )
}
