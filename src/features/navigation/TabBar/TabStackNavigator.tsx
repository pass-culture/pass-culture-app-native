import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import React, { ComponentType, FunctionComponent } from 'react'

import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { Favorites } from 'features/favorites/pages/Favorites'
import { Home } from 'features/home/pages/Home'
import { withAuthProtection } from 'features/navigation/RootNavigator/linking/withAuthProtection'
import { SuspenseSearchStackNavigator } from 'features/navigation/SearchStackNavigator/SuspenseSearchStackNavigator'
import { TabStackNavigatorBase } from 'features/navigation/TabBar/TabStackNavigatorBase'
import { Profile } from 'features/profile/pages/Profile/Profile'
import { useColorScheme } from 'libs/styled/useColorScheme'

import { TabBar } from './TabBar'

const initialRouteName = 'Home'

// For some reason, inlining "withAsyncErrorBoundary(Home)" directly in the Screen's component prop causes unexpected behavior on the home (when pressing the home tab, the whole page refreshes instead of scrolling to the top of the home)
const HomeWithAsyncErrorBoundary = withAsyncErrorBoundary(Home)

const TAB_NAVIGATOR_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  freezeOnBlur: true,
}

function renderTabBar({ state, navigation }: BottomTabBarProps) {
  return <TabBar navigation={navigation} state={state} />
}

const withRemountOnColorSchemeHOC = <Props extends object>(
  WrappedComponent: ComponentType<Props>
): ComponentType<Props> => {
  const ComponentKeyedByColorScheme: FunctionComponent<Props> = (props) => {
    const colorScheme = useColorScheme()
    return <WrappedComponent key={colorScheme} {...props} />
  }

  ComponentKeyedByColorScheme.displayName = `withRemountOnColorSchemeHOC(${WrappedComponent.name})`

  return ComponentKeyedByColorScheme
}

/**
 * We keep freezeOnBlur=true to improve perf on background tabs.
 * React Navigation freezes the subtree (react-freeze), so context updates (like theme tokens) won’t propagate
 * while the tab is blurred. To reflect theme changes immediately when focusing Home again,
 * we key the screen by the effective color scheme to force a clean remount.
 */
const HomeScreenKeyedByScheme = withRemountOnColorSchemeHOC(HomeWithAsyncErrorBoundary)
const SearchStackKeyedByScheme = withRemountOnColorSchemeHOC(SuspenseSearchStackNavigator)
const BookingsKeyedByScheme = withRemountOnColorSchemeHOC(
  withAsyncErrorBoundary(withAuthProtection(Bookings))
)
const FavoritesKeyedByScheme = withRemountOnColorSchemeHOC(withAsyncErrorBoundary(Favorites))
const ProfileKeyedByScheme = withRemountOnColorSchemeHOC(withAsyncErrorBoundary(Profile))

export const TabNavigator: React.FC = () => {
  return (
    <TabStackNavigatorBase.Navigator
      initialRouteName={initialRouteName}
      tabBar={renderTabBar}
      screenOptions={TAB_NAVIGATOR_SCREEN_OPTIONS}
      backBehavior="history">
      <TabStackNavigatorBase.Screen
        name="Home"
        component={HomeScreenKeyedByScheme}
        options={{ title: 'Page d’accueil' }}
      />
      <TabStackNavigatorBase.Screen
        name="_DeeplinkOnlyHome1"
        component={HomeScreenKeyedByScheme}
        options={{ title: 'Page d’accueil' }}
      />
      <TabStackNavigatorBase.Screen
        name="SearchStackNavigator"
        component={SearchStackKeyedByScheme}
        options={{ title: 'Rechercher' }}
      />
      <TabStackNavigatorBase.Screen
        name="Bookings"
        component={BookingsKeyedByScheme}
        options={{ title: 'Mes réservations' }}
      />
      <TabStackNavigatorBase.Screen
        name="_DeeplinkOnlyBookings1"
        component={BookingsKeyedByScheme}
        options={{ title: 'Mes réservations' }}
      />
      <TabStackNavigatorBase.Screen
        name="Favorites"
        component={FavoritesKeyedByScheme}
        options={{ title: 'Mes favoris' }}
      />
      <TabStackNavigatorBase.Screen
        name="Profile"
        component={ProfileKeyedByScheme}
        options={{ title: 'Mon profil' }}
      />
    </TabStackNavigatorBase.Navigator>
  )
}
