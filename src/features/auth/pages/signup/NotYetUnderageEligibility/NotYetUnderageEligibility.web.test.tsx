import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'

import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { NotYetUnderageEligibility } from './NotYetUnderageEligibility'

const navigationProps = {
  route: { params: { eligibilityStartDatetime: '2019-12-01T00:00:00Z' } },
} as NativeStackScreenProps<RootStackParamList, 'NotYetUnderageEligibility'>

jest.mock('libs/firebase/analytics/analytics')

describe('<NotYetUnderageEligibility/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<NotYetUnderageEligibility {...navigationProps} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
