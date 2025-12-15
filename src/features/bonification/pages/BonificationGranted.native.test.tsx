import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { BonificationGranted } from 'features/bonification/pages/BonificationGranted'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/jwt/jwt')

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

describe('BonificationGranted', () => {
  beforeEach(() => setFeatureFlags())

  it('should go reset to home when pressing "J’en profite"', async () => {
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

  it('should show snackbar when pressing "J’en profite" but call fails', async () => {
    mockServer.postApi('/v1/reset_recredit_amount_to_show', {
      responseOptions: { statusCode: 500, data: {} },
    })

    render(reactQueryProviderHOC(<BonificationGranted />))

    const button = screen.getByText('J’en profite')
    await userEvent.press(button)

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({ message: 'Une erreur est survenue' })
  })
})
