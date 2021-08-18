import { DeeplinkPath } from 'features/deeplinks/enums'
import { screenParamsParser } from 'features/navigation/screenParamsUtils'

import { Route } from '../types'

const MockComponent = () => null

export const routes: Array<Route> = [
  {
    name: 'TabNavigator',
    component: MockComponent,
    pathConfig: {
      initialRouteName: 'Home',
      screens: {
        Home: DeeplinkPath.HOME,
      },
    },
  },
  {
    name: 'Offer',
    component: MockComponent,
    pathConfig: {
      path: DeeplinkPath.OFFER,
      parse: screenParamsParser['Offer'],
    },
  },
]
