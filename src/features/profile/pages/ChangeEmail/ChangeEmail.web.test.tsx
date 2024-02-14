import React from 'react'

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

describe('<ChangeEmail/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<ChangeEmail />))

      await act(async () => {
        await waitFor(() => {
          expect(screen.getByTestId('Entrée pour l’email')).toHaveFocus()
        })

        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
