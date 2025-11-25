import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import {
  screenParamsParser,
  screenParamsStringifier,
} from 'features/navigation/helpers/screenParamsUtils'
import { SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/navigators/SearchStackNavigator/searchStackNavigationOptions'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { SearchView } from 'features/search/types'

const searchStackNavigatorConfig = {
  initialRouteName: 'SearchLanding',
  screenOptions: SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS,
  screens: {
    SearchLanding: {
      screen: SearchLanding,
      linking: {
        path: 'recherche/accueil',
        parse: screenParamsParser[SearchView.Landing],
        stringify: screenParamsStringifier[SearchView.Landing],
      },
    },
    SearchResults: {
      screen: SearchResults,
      linking: {
        path: 'recherche/resultats',
        parse: screenParamsParser[SearchView.Results],
        stringify: screenParamsStringifier[SearchView.Results],
      },
    },
    ThematicSearch: {
      screen: ThematicSearch,
      linking: {
        path: 'recherche/thematique',
        parse: screenParamsParser[SearchView.Thematic],
        stringify: screenParamsStringifier[SearchView.Thematic],
      },
    },
  },
}

const SearchStackNavigator = createNativeStackNavigator(searchStackNavigatorConfig)
export const SearchStackScreen = createComponentForStaticNavigation(SearchStackNavigator, 'Search')
