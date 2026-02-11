import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { BonificationGranted } from 'features/bonification/pages/BonificationGranted'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/jwt/jwt')

const mockRefetchUser = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ refetchUser: mockRefetchUser })),
}))

describe('BonificationGranted', () => {
  beforeEach(() => setFeatureFlags())

  describe('when pressing "J’en profite" and call to reset re-credit amount to show succeeds', () => {
    it('should reset to home', async () => {
      mockServer.postApi('/v1/reset_recredit_amount_to_show', {
        responseOptions: { statusCode: 200, data: {} },
      })

      render(reactQueryProviderHOC(<BonificationGranted />))

      const button = screen.getByText('J’en profite')
      await userEvent.press(button)

      expect(reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'TabNavigator' }],
      })
    })

    it('should refetch user', async () => {
      mockServer.postApi('/v1/reset_recredit_amount_to_show', {
        responseOptions: { statusCode: 200, data: {} },
      })

      render(reactQueryProviderHOC(<BonificationGranted />))

      const button = screen.getByText('J’en profite')
      await userEvent.press(button)

      expect(mockRefetchUser).toHaveBeenCalledTimes(1)
    })
  })

  describe('when pressing "J’en profite" and call to reset re-credit amount to show fails', () => {
    it('should show snackbar', async () => {
      mockServer.postApi('/v1/reset_recredit_amount_to_show', {
        responseOptions: { statusCode: 500, data: {} },
      })

      render(reactQueryProviderHOC(<BonificationGranted />))

      const button = screen.getByText('J’en profite')
      await userEvent.press(button)

      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(screen.getByText('Une erreur est survenue')).toBeOnTheScreen()
    })

    it('should reset to home', async () => {
      mockServer.postApi('/v1/reset_recredit_amount_to_show', {
        responseOptions: { statusCode: 500, data: {} },
      })

      render(reactQueryProviderHOC(<BonificationGranted />))

      const button = screen.getByText('J’en profite')
      await userEvent.press(button)

      expect(reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'TabNavigator' }],
      })
    })

    it('should refetch user', async () => {
      mockServer.postApi('/v1/reset_recredit_amount_to_show', {
        responseOptions: { statusCode: 500, data: {} },
      })

      render(reactQueryProviderHOC(<BonificationGranted />))

      const button = screen.getByText('J’en profite')
      await userEvent.press(button)

      expect(mockRefetchUser).toHaveBeenCalledTimes(1)
    })
  })
})
