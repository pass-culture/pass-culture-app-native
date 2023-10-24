import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'

import { EmailHistoryEventTypeEnum } from 'api/gen'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { checkAccessibilityFor, render } from 'tests/utils/web'

type UseEmailUpdateStatusMock = ReturnType<typeof useEmailUpdateStatus['useEmailUpdateStatus']>

jest.spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus').mockReturnValue({
  data: {
    expired: false,
    newEmail: '',
    status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
  },
  isLoading: false,
} as UseEmailUpdateStatusMock)
jest.mock('react-query')

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
      const { container } = render(<ConfirmChangeEmail navigation={navigation} route={route} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
