import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import { EmailHistoryEventTypeEnum } from 'api/gen'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useEmailUpdateStatusV2 from 'features/profile/helpers/useEmailUpdateStatusV2'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

type UseEmailUpdateStatusV2Mock = ReturnType<
  (typeof useEmailUpdateStatusV2)['useEmailUpdateStatusV2']
>

jest.spyOn(useEmailUpdateStatusV2, 'useEmailUpdateStatusV2').mockReturnValue({
  data: {
    expired: false,
    newEmail: '',
    status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
  },
  isLoading: false,
} as UseEmailUpdateStatusV2Mock)

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<SuspendAccountConfirmation />', () => {
  describe('Accessibility', () => {
    const navigation = {
      navigate: jest.fn(),
    } as unknown as NativeStackNavigationProp<RootStackParamList, 'SuspendAccountConfirmation'>

    const route = {
      params: {
        token: 'example',
      },
    } as unknown as RouteProp<RootStackParamList, 'SuspendAccountConfirmation'>

    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        reactQueryProviderHOC(<SuspendAccountConfirmation navigation={navigation} route={route} />)
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
