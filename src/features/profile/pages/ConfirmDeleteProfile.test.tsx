import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { goBack } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { superFlushWithAct, fireEvent, render } from 'tests/utils'

import { ConfirmDeleteProfile } from './ConfirmDeleteProfile'

const mockSignOut = jest.fn()
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

describe('ConfirmDeleteProfile component', () => {
  it('should render confirm delete profile', () => {
    const renderAPI = render(reactQueryProviderHOC(<ConfirmDeleteProfile />))
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should redirect to DeleteProfileSuccess when clicking on "Je supprime mon compte" button', async () => {
    const renderAPI = render(reactQueryProviderHOC(<ConfirmDeleteProfile />))
    fireEvent.press(renderAPI.getByText('Supprimer mon compte'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('DeleteProfileSuccess')
      expect(analytics.logLogout).toBeCalled()
      expect(mockSignOut).toBeCalled()
    })
  })

  it('should redirect to LegalNotices when clicking on "Abandonner" button', () => {
    const renderAPI = render(reactQueryProviderHOC(<ConfirmDeleteProfile />))
    fireEvent.press(renderAPI.getByText('Abandonner'))
    expect(goBack).toBeCalledTimes(1)
  })
})
