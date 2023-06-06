import React from 'react'

import { EmailHistoryEventTypeEnum } from 'api/gen'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus').mockReturnValue({
  data: {
    expired: false,
    newEmail: '',
    status: EmailHistoryEventTypeEnum.CONFIRMATION,
  },
  isLoading: false,
})

describe('<ConfirmChangeEmail />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ConfirmChangeEmail />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
