import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { goBack } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { ConfirmDeleteProfile } from './ConfirmDeleteProfile'

const mockSignOut = jest.fn()
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

describe('ConfirmDeleteProfile component', () => {
  it('should render confirm delete profile', () => {
    const renderAPI = render(<ConfirmDeleteProfile />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should open mail app when clicking on "Je supprime mon compte" button', () => {
    const renderAPI = render(<ConfirmDeleteProfile />)
    fireEvent.press(renderAPI.getByText(`Je supprime mon compte`))
    expect(navigate).toHaveBeenCalledWith('DeleteProfileSuccess')
    expect(analytics.logLogout).toBeCalled()
    expect(mockSignOut).toBeCalled()
  })

  it('should redirect to LegalNotices when clicking on "Abandonner" button', () => {
    const renderAPI = render(<ConfirmDeleteProfile />)
    fireEvent.press(renderAPI.getByText(`Abandonner`))
    expect(goBack).toBeCalledTimes(1)
  })
})
