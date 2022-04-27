import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render } from 'tests/utils'

import { DeleteProfileSuccess } from '../DeleteProfileSuccess'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

const mockSettings = {
  allowAccountReactivation: false,
}

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

describe('DeleteProfileSuccess component', () => {
  it('should render delete profile success', () => {
    const renderAPI = render(<DeleteProfileSuccess />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it(`should redirect to Home page when clicking on "Retourner à l'accueil" button`, async () => {
    const renderAPI = render(<DeleteProfileSuccess />)
    fireEvent.press(renderAPI.getByText(`Retourner à l'accueil`))
    await waitForExpect(() => {
      expect(navigateFromRef).toBeCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })

  it('should not display reactivation button if account reactivation feature flag is deactivated', () => {
    const renderAPI = render(<DeleteProfileSuccess />)
    expect(renderAPI.queryByText('Réactiver mon compte')).toBeFalsy()
  })

  it('should display reactivation button if account reactivation feature flag is activated', () => {
    mockSettings.allowAccountReactivation = true
    const renderAPI = render(<DeleteProfileSuccess />)
    expect(renderAPI.queryByText('Réactiver mon compte')).toBeTruthy()
  })

  it(`should redirect to Home page when clicking on "Retourner à l'accueil" button of new success screen`, async () => {
    mockSettings.allowAccountReactivation = true
    const renderAPI = render(<DeleteProfileSuccess />)
    fireEvent.press(renderAPI.getByText(`Retourner à l'accueil`))
    await waitForExpect(() => {
      expect(navigateFromRef).toBeCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })
})
