import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import * as LoginRoutine from 'features/auth/helpers/useLoginRoutine'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { ReinitializePassword } from './ReinitializePassword'

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.spyOn(LoginRoutine, 'useLoginRoutine').mockReturnValue(jest.fn())

jest.mock('libs/firebase/analytics/analytics')

describe('<ReinitializePassword/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderReinitializePassword()

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})

function renderReinitializePassword() {
  return render(
    reactQueryProviderHOC(
      <SafeAreaProvider>
        <ReinitializePassword />
      </SafeAreaProvider>
    )
  )
}
