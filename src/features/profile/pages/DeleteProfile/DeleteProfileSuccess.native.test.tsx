import React from 'react'

import * as LogoutRoutine from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render, screen } from 'tests/utils'

import { DeleteProfileSuccess } from './DeleteProfileSuccess'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

const signOutMock = jest.fn()
jest.spyOn(LogoutRoutine, 'useLogoutRoutine').mockReturnValue(signOutMock)

jest.mock('libs/firebase/analytics/analytics')

describe('DeleteProfileSuccess component', () => {
  it('should render delete profile success', () => {
    render(<DeleteProfileSuccess />)

    expect(screen).toMatchSnapshot()
  })

  it('should log out user', () => {
    render(<DeleteProfileSuccess />)

    expect(signOutMock).toHaveBeenCalledTimes(1)
  })

  it('should redirect to Home page when clicking on "Retourner à l’accueil" button', () => {
    render(<DeleteProfileSuccess />)

    fireEvent.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
