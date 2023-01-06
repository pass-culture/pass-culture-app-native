import React from 'react'

import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { ConsentSettings } from './ConsentSettings'

jest.mock('react-query')

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

describe('<ConsentSettings/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockV4.mockReturnValueOnce('acceptedAll').mockReturnValueOnce('declineAll')
      const { container } = render(<ConsentSettings />)

      await act(async () => {
        const results = await checkAccessibilityFor(container, {
          // TODO(PC-19659): Fix FilterSwitch accessibility errors
          rules: {
            'aria-toggle-field-name': { enabled: false },
          },
        })
        expect(results).toHaveNoViolations()
      })
    })
  })
})
