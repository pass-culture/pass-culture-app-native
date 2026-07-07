import {
  createComponentForStaticNavigation,
  createPathConfigForStaticNavigation,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import {
  screenParamsParser,
  screenParamsStringifier,
} from 'features/navigation/helpers/screenParamsUtils'
import { SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/navigators/SearchStackNavigator/searchStackNavigationOptions'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResultsContainer } from 'features/search/pages/SearchResults/SearchResultsContainer'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { ThematicSearchSubcategories } from 'features/search/pages/ThematicSearch/ThematicSearchSubcategories'
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
      screen: SearchResultsContainer,
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
    ThematicSearchSubcategories: {
      screen: ThematicSearchSubcategories,
      linking: {
        path: 'recherche/thematique/toutes-les-categories',
        parse: screenParamsParser.ThematicSearchSubcategories,
        stringify: screenParamsStringifier.ThematicSearchSubcategories,
      },
    },
  },
}

const SearchStackNavigator = createNativeStackNavigator(searchStackNavigatorConfig)
export const SearchStackScreen = createComponentForStaticNavigation(SearchStackNavigator)

export const SEARCH_STACK_LINKING_SCREENS =
  createPathConfigForStaticNavigation(SearchStackNavigator)
