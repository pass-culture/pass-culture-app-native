import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { Search } from 'features/search/pages/Search/Search'

import { SearchRoute } from './types'

export const routes: SearchRoute[] = [
  {
    name: 'Search',
    component: Search,
    pathConfig: {
      path: 'recherche',
      parse: screenParamsParser['Search'],
      stringify: screenParamsStringifier['Search'],
    },
    options: { title: 'Filtres de recherche' },
  },
]
