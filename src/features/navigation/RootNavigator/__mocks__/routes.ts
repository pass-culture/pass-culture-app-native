import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/__mocks__/routes'

import { RootRoute } from '../types'

const MockComponent = () => null
export const routes: Array<RootRoute> = [
  { name: 'PageNotFound', component: MockComponent, path: '*' },
  { name: 'TabNavigator', component: MockComponent, pathConfig: tabNavigatorPathConfig },
  {
    name: 'Offer',
    component: MockComponent,
    pathConfig: { path: 'offre/:id', parse: screenParamsParser['Offer'] },
  },
  {
    name: 'Venue',
    component: MockComponent,
    pathConfig: { path: 'lieu/:id', parse: screenParamsParser['Venue'] },
  },
]
