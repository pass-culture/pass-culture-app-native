import React from 'react'

import { EmailHistoryEventTypeEnum } from 'api/gen'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { SuspendAccountConfirmation } from 'features/profile/pages/SuspendAccountConfirmation/SuspendAccountConfirmation'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus').mockReturnValue({
  data: {
    expired: false,
    newEmail: '',
    status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
  },
})

describe('<SuspendAccountConfirmation />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SuspendAccountConfirmation />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
