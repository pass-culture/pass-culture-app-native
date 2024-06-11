import React from 'react'

import { EmailHistoryEventTypeEnum } from 'api/gen'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

type UseEmailUpdateStatusMock = ReturnType<(typeof useEmailUpdateStatus)['useEmailUpdateStatus']>

jest.spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus').mockReturnValue({
  data: {
    expired: false,
    newEmail: '',
    status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
  },
  isLoading: false,
} as UseEmailUpdateStatusMock)

jest.mock('libs/firebase/analytics/analytics')

describe('<ConfirmChangeEmail />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<ConfirmChangeEmail />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
