export const tabNavigatorPathConfig = {
  TabNavigator: {
    initialRouteName: 'Home',
    screens: {
      Home: {
        path: 'accueil',
        parse: {},
      },
      _DeeplinkOnlyHome1: {
        path: 'home',
        parse: {},
      },
      SearchStackNavigator: {
        initialRouteName: 'SearchLanding',
        screens: {
          SearchLanding: {
            path: 'recherche/accueil',
            parse: {},
            stringify: {},
          },
          SearchResults: {
            path: 'recherche/resultats',
            parse: {},
            stringify: {},
          },
          ThematicSearch: {
            path: 'recherche/thematique',
            parse: {},
            stringify: {},
          },
        },
      },
      Bookings: {
        path: 'reservations',
      },
      _DeeplinkOnlyBookings1: {
        path: 'bookings',
      },
      Favorites: {
        path: 'favoris',
      },
      Profile: {
        path: 'profil',
      },
    },
  },
}
