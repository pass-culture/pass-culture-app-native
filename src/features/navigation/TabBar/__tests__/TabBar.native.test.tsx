import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import React from 'react'

import {
  DEFAULT_TAB_ROUTES,
  useTabNavigationContext,
} from 'features/navigation/TabBar/TabNavigationStateContext'
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

const navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap> = {
  // @ts-expect-error : ignore type of emit to facilitate testing
  emit: jest.fn(() => ({ defaultPrevented: false })),
  navigate: jest.fn(),
}

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

  // TODO(PC-13119): Add native stories for this component
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('render correctly', () => {
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

  it('does not reset navigation when clicked on selected tab', () => {
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

    expect(navigation.emit).not.toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('should reset navigation when clicked on selected home tab', async () => {
    renderTabBar()
    expect(screen.getByTestId('Accueil sélectionné')).toBeOnTheScreen()

    const homeTab = screen.getByTestId('Accueil')
    fireEvent.press(homeTab)

    expect(navigation.emit).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('navigates to Profile on Profile tab click', async () => {
    renderTabBar()
    const profileTab = screen.getByTestId('Mon profil')

    fireEvent.press(profileTab)

    expect(navigation.navigate).toBeCalledWith('TabNavigator', {
      screen: 'Profile',
      params: undefined,
    })
  })
})

function renderTabBar() {
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<TabBar navigation={navigation} />)
  )
}
