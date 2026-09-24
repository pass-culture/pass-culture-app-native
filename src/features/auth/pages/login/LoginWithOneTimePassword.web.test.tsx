import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { render, checkAccessibilityFor, waitFor } from 'tests/utils/web'

import { LoginWithOneTimePassword } from './LoginWithOneTimePassword'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<LoginWithOneTimePassword />', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.mocked(AsyncStorage.getItem).mockResolvedValue(null)
    jest.mocked(AsyncStorage.setItem).mockResolvedValue(undefined)
    jest.mocked(AsyncStorage.removeItem).mockResolvedValue(undefined)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<LoginWithOneTimePassword />)

      await waitFor(() => {
        expect(container).toHaveTextContent(
          'Saisis le code de vérification que tu as reçu à l’adresse'
        )
      })

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
