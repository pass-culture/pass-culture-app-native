import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { render, checkAccessibilityFor } from 'tests/utils/web'

import { NotYetUnderageEligibility } from './NotYetUnderageEligibility'

const navigationProps = {
  route: { params: { eligibilityStartDatetime: '2019-12-01T00:00:00Z' } },
} as StackScreenProps<RootStackParamList, 'NotYetUnderageEligibility'>

describe('<NotYetUnderageEligibility/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<NotYetUnderageEligibility {...navigationProps} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
