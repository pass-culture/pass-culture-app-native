import React from 'react'

import { UpdateEmailTokenExpiration } from 'api/gen'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, checkAccessibilityFor, waitFor, screen } from 'tests/utils/web'

import { ChangeEmail } from './ChangeEmail'

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

describe('<ChangeEmail/> - old version', () => {
  jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockServer.getApiV1<UpdateEmailTokenExpiration>('/profile/token_expiration', {
        expiration: null,
      })
      const { container } = render(reactQueryProviderHOC(<ChangeEmail />))

      await waitFor(() => {
        expect(screen.getByTestId('Entrée pour l’email')).toHaveFocus()
      })

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
