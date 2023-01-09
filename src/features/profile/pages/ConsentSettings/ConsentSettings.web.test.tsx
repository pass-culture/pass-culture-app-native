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

// Hack to not fail accessibility tests 'aria-toggle-field-name'
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

describe('<ConsentSettings/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<ConsentSettings />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
