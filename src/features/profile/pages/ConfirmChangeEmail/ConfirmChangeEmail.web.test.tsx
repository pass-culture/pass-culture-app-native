import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useCheckHasCurrentEmailChange from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.spyOn(useCheckHasCurrentEmailChange, 'useCheckHasCurrentEmailChange').mockReturnValue({
  hasCurrentEmailChange: true,
})

describe('<ConfirmChangeEmail />', () => {
  const navigation = {
    navigate: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, 'ConfirmChangeEmail'>

  const route = {
    params: {
      token: 'example',
    },
  } as unknown as RouteProp<RootStackParamList, 'ConfirmChangeEmail'>

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ConfirmChangeEmail navigation={navigation} route={route} />, {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
