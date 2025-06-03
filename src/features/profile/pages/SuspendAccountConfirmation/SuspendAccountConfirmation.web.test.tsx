import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import { EmailHistoryEventTypeEnum } from 'api/gen'
import { ProfileStackParamList } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

type useEmailUpdateStatusMock = ReturnType<(typeof useEmailUpdateStatus)['useEmailUpdateStatus']>

jest.spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus').mockReturnValue({
  data: {
    expired: false,
    newEmail: '',
    status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
  },
  isLoading: false,
} as useEmailUpdateStatusMock)

jest.mock('libs/firebase/analytics/analytics')

describe('<SuspendAccountConfirmation />', () => {
  describe('Accessibility', () => {
    const navigation = {
      navigate: jest.fn(),
    } as unknown as NativeStackNavigationProp<
      RootStackParamList & ProfileStackParamList,
      'SuspendAccountConfirmation'
    >

    const route = {
      params: {
        token: 'example',
      },
    } as unknown as RouteProp<
      RootStackParamList & ProfileStackParamList,
      'SuspendAccountConfirmation'
    >

    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        reactQueryProviderHOC(<SuspendAccountConfirmation navigation={navigation} route={route} />)
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
