import { DeeplinkPath } from 'features/deeplinks/enums'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'
import { tabNavigatorPathConfig } from 'features/navigation/TabBar/routes'

import { Route } from '../types'

const MockComponent = () => null

export const routes: Array<Route> = [
  { name: 'PageNotFound', component: MockComponent, path: '*' },
  { name: 'TabNavigator', component: MockComponent, pathConfig: tabNavigatorPathConfig },
  {
    name: 'Offer',
    component: MockComponent,
    pathConfig: { path: DeeplinkPath.OFFER, parse: screenParamsParser['Offer'] },
  },
]
