import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, TabNavigationState, ParamListBase } from '@react-navigation/native'
import React from 'react'

import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import {
  DEFAULT_TAB_ROUTES,
  useTabNavigationContext,
} from 'features/navigation/TabBar/TabNavigationStateContext'
import { initialSearchState } from 'features/search/context/reducer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

import { TabBar } from '../TabBar'

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

jest.mock('features/navigation/RootNavigator/routes', () => ({
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

const mockSearchState = initialSearchState
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

describe('TabBar', () => {
  beforeEach(() => {
    mockedUseTabNavigationContext.mockReturnValue({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Home',
      })),
    })
  })

  it('render correctly', () => {
    renderTabBar()

    expect(screen).toMatchSnapshot()
  })

  it('should display the 5 following tabs with Home selected', async () => {
    renderTabBar()

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
    renderTabBar()
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
    renderTabBar()

    expect(screen.queryAllByTestId(/sélectionné/)).toHaveLength(1)
  })

  it('should navigate again to Profil tab on click Profil tab icon when Profil tab is already selected', () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Profile',
      })),
    })
    renderTabBar()

    expect(screen.getByTestId('Mon profil sélectionné')).toBeOnTheScreen()

    const profileTab = screen.getByTestId('Mon profil')
    fireEvent.press(profileTab)

    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('should navigate again to Home tab on click Home tab icon when Home tab is already selected', async () => {
    renderTabBar()

    expect(screen.getByTestId('Accueil sélectionné')).toBeOnTheScreen()

    const homeTab = screen.getByTestId('Accueil')
    fireEvent.press(homeTab)

    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('should reset Search navigation params when clicked on selected Search tab', () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'SearchStackNavigator',
      })),
    })
    renderTabBar()

    screen.getByTestId('Rechercher des offres sélectionné')

    const searchTab = screen.getByTestId('Rechercher des offres')
    fireEvent.press(searchTab)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_STATE', payload: initialSearchState })
  })

  it('should reset Search accessibility navigation params when clicked on selected Search tab', () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'SearchStackNavigator',
      })),
    })
    renderTabBar()

    screen.getByTestId('Rechercher des offres sélectionné')

    const searchTab = screen.getByTestId('Rechercher des offres')
    fireEvent.press(searchTab)

    expect(mockSetDisabilities).toHaveBeenCalledWith(undefined)
  })

  it('navigates to Profile on Profile tab click', async () => {
    renderTabBar()
    const profileTab = screen.getByTestId('Mon profil')

    fireEvent.press(profileTab)

    expect(navigation.navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'Profile',
      params: undefined,
    })
  })

  it('should call navigate with searchState params on press "Recherche"', async () => {
    renderTabBar()
    const searchButton = screen.getByText('Recherche')
    fireEvent.press(searchButton)

    expect(navigation.navigate).toHaveBeenCalledWith(
      ...getTabNavConfig('SearchStackNavigator', {
        screen: 'Search',
        params: { ...mockSearchState, accessibilityFilter: mockAccessibilityState },
      })
    )
  })
})

function renderTabBar() {
  render(reactQueryProviderHOC(<TabBar navigation={navigation} state={mockTabNavigationState} />))
}
