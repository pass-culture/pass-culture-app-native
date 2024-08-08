import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as LogoutRoutine from 'features/auth/helpers/useLogoutRoutine'
import { DeleteProfileReason } from 'features/profile/pages/DeleteProfileReason/DeleteProfileReason'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/context/SettingsContext')

const signOutMock = jest.fn()
jest.spyOn(LogoutRoutine, 'useLogoutRoutine').mockReturnValue(signOutMock)

jest.mock('libs/firebase/analytics/analytics')

describe('<DeleteProfileReason />', () => {
  it('should match snapshot', () => {
    render(<DeleteProfileReason />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to Home page when clicking on "Autre"', () => {
    render(<DeleteProfileReason />)

    fireEvent.press(screen.getByText(`Autre`))

    expect(navigate).toHaveBeenCalledWith('ConfirmDeleteProfile', undefined)
  })
})
