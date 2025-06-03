import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import { ProfileStackParamList } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { ValidateEmailChange } from 'features/profile/pages/ValidateEmailChange/ValidateEmailChange'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('features/profile/helpers/useEmailUpdateStatus', () => ({
  useEmailUpdateStatus: jest.fn().mockReturnValue({
    data: {
      newEmail: 'john@doe.com',
    },
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('<ValidationChangeEmail />', () => {
  const navigation = {
    navigate: jest.fn(),
  } as unknown as NativeStackNavigationProp<
    RootStackParamList & ProfileStackParamList,
    'ValidateEmailChange'
  >

  const route = {
    params: {
      token: 'example',
    },
  } as unknown as RouteProp<RootStackParamList & ProfileStackParamList, 'ValidateEmailChange'>

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        reactQueryProviderHOC(<ValidateEmailChange navigation={navigation} route={route} />)
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
