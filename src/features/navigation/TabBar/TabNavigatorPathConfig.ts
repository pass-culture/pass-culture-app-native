import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { SearchView } from 'features/search/types'

export const tabNavigatorPathConfig = {
  TabNavigator: {
    initialRouteName: 'Home',
    screens: {
      Home: {
        path: 'accueil',
        parse: screenParamsParser['Home'],
      },
      _DeeplinkOnlyHome1: {
        path: 'home',
        parse: screenParamsParser['Home'],
      },
      SearchStackNavigator: {
        initialRouteName: 'SearchLanding',
        screens: {
          SearchLanding: {
            path: 'recherche/accueil',
            parse: screenParamsParser[SearchView.Landing],
            stringify: screenParamsStringifier[SearchView.Landing],
          },
          SearchResults: {
            path: 'recherche/resultats',
            parse: screenParamsParser[SearchView.Results],
            stringify: screenParamsStringifier[SearchView.Results],
          },
          ThematicSearch: {
            path: 'recherche/thematique',
            parse: screenParamsParser[SearchView.Thematic],
            stringify: screenParamsStringifier[SearchView.Thematic],
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
