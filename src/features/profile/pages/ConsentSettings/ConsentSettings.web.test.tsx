import React from 'react'

import * as useGoBack from 'features/navigation/useGoBack'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { ConsentSettings } from './ConsentSettings'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    push: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    addListener: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
  useRoute: () => ({ params: {} }),
}))

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

describe('<ConsentSettings/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<ConsentSettings />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
