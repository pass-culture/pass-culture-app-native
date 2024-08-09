import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as LogoutRoutine from 'features/auth/helpers/useLogoutRoutine'
import { DeleteProfileReason } from 'features/profile/pages/DeleteProfileReason/DeleteProfileReason'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

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

  it('should redirect to Home page when clicking on "Autre"', async () => {
    render(<DeleteProfileReason />)

    fireEvent.press(screen.getByText('Autre'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('ConfirmDeleteProfile', undefined)
    })
  })

  it('should log analytics when clicking on reasonButton', () => {
    render(<DeleteProfileReason />)

    fireEvent.press(screen.getByText('Autre'))

    expect(analytics.logSelectDeletionReason).toHaveBeenNthCalledWith(1, 'other')
  })
})
