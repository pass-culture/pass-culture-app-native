import React from 'react'

import { EmailHistoryEventTypeEnum } from 'api/gen'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ValidationChangeEmail } from 'features/profile/pages/ValidationChangeEmail/ValidationChangeEmail'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('react-query')
jest.spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus').mockReturnValue({
  data: {
    expired: false,
    newEmail: 'test123@mail.fr',
    status: EmailHistoryEventTypeEnum.VALIDATION,
  },
  isLoading: false,
})

describe('<ValidationChangeEmail />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ValidationChangeEmail />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
