import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import {
  DEFAULT_TAB_ROUTES,
  useTabNavigationContext,
} from 'features/navigation/TabBar/TabNavigationStateContext'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, superFlushWithAct } from 'tests/utils'

import { TabBar } from '../TabBar'

jest.mock('features/navigation/TabBar/TabNavigationStateContext', () => {
  const { DEFAULT_TAB_ROUTES } = jest.requireActual(
    'features/navigation/TabBar/TabNavigationStateContext'
  )
  return { DEFAULT_TAB_ROUTES, useTabNavigationContext: jest.fn() }
})
const mockedUseTabNavigationContext = mocked(useTabNavigationContext)

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

  it('renders correctly', async () => {
    const renderAPI = await renderTabBar()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display the 5 following tabs with Home selected', async () => {
    const { queryByTestId } = await renderTabBar()

    const expectedTabsTestIds = [
      'Accueil sélectionné',
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Mes favoris',
      'Mon profil',
    ].sort()

    expectedTabsTestIds.map((tab) => {
      expect(queryByTestId(tab)).toBeTruthy()
    })
  })

  it('should display the 5 following tabs with Bookings selected', async () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Bookings',
      })),
    })
    const { queryByTestId } = await renderTabBar()
    const expectedTabsTestIds = [
      'Accueil',
      'Rechercher des offres',
      'Mes réservations',
      'Mes réservations sélectionné',
      'Mes favoris',
      'Mon profil',
    ].sort()

    expectedTabsTestIds.map((tab) => {
      expect(queryByTestId(tab)).toBeTruthy()
    })
  })

  it('displays only one selected at a time', async () => {
    const renderAPI = await renderTabBar()
    expect(renderAPI.queryAllByTestId(/sélectionné/)).toHaveLength(1)
  })

  it('does not reset navigation when clicked on selected tab', async () => {
    mockedUseTabNavigationContext.mockReturnValueOnce({
      setTabNavigationState: jest.fn(),
      tabRoutes: DEFAULT_TAB_ROUTES.map((route) => ({
        ...route,
        isSelected: route.name === 'Profile',
      })),
    })
    const renderAPI = await renderTabBar()
    expect(renderAPI.queryByTestId('Mon profil sélectionné')).toBeTruthy()

    const profileTab = renderAPI.getByTestId('Mon profil')
    fireEvent.press(profileTab)

    expect(navigation.emit).not.toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('should reset navigation when clicked on selected home tab', async () => {
    const renderAPI = await renderTabBar()
    expect(renderAPI.queryByTestId('Accueil sélectionné')).toBeTruthy()

    const homeTab = renderAPI.getByTestId('Accueil')
    fireEvent.press(homeTab)

    expect(navigation.emit).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
  })

  it('navigates to Profile on Profile tab click', async () => {
    const renderAPI = await renderTabBar()
    const profileTab = renderAPI.getByTestId('Mon profil')

    fireEvent.press(profileTab)

    expect(navigation.navigate).toBeCalledWith('TabNavigator', {
      screen: 'Profile',
      params: undefined,
    })
  })
})

async function renderTabBar() {
  const renderAPI = render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<TabBar navigation={navigation} />)
  )
  await superFlushWithAct()
  return renderAPI
}
