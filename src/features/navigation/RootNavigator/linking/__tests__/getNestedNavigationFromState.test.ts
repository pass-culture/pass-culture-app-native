import { NavigationResultState, RootNavigateParams } from 'features/navigation/RootNavigator/types'

import { state1, state2, state3 } from '../../fixtures/navigationState'
import { getNestedNavigationFromState } from '../getNestedNavigationFromState'

describe('getNestedNavigationFromState()', () => {
  it.each`
    stateName   | state     | expectedScreen | expectedParams
    ${'state1'} | ${state1} | ${'Search'}    | ${undefined}
    ${'state2'} | ${state2} | ${'Login'}     | ${undefined}
    ${'state3'} | ${state3} | ${'Home'}      | ${{ entryId: '666' }}
  `(
    'getNestedNavigationFromState($stateName) should return [$expectedScreen, $expectedParams]',
    ({
      state,
      expectedScreen,
      expectedParams,
    }: {
      state: NavigationResultState
      expectedScreen: RootNavigateParams[0]
      expectedParams: RootNavigateParams[1]
    }) => {
      const [screen, params] = getNestedNavigationFromState(state)
      expect(screen).toEqual(expectedScreen)
      expect(params).toEqual(expectedParams)
    }
  )
})
