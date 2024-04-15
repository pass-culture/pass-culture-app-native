import { screenParamsParser } from 'features/navigation/screenParamsUtils'

import { RootRoute } from '../types'

const MockComponent = () => null
export const routes: Array<RootRoute> = [
  { name: 'PageNotFound', component: MockComponent, path: '*' },
  { name: 'TabNavigator', component: MockComponent, path: 'test' },
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
