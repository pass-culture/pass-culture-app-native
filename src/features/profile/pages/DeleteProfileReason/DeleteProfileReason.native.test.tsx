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

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<DeleteProfileReason />', () => {
  it('should match snapshot', () => {
    render(<DeleteProfileReason />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to ChangeEmail page with correct params when clicking on change email button', async () => {
    render(<DeleteProfileReason />)

    fireEvent.press(
      screen.getByText('J’aimerais créer un compte avec une adresse e-mail différente')
    )

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('ChangeEmail', { showModal: true })
    })
  })

  it('should redirect to Home page when clicking on "Autre" button', async () => {
    render(<DeleteProfileReason />)

    fireEvent.press(screen.getByText('Autre'))

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('DeleteProfileContactSupport', undefined)
    })
  })

  it('should log analytics when clicking on reasonButton', () => {
    render(<DeleteProfileReason />)

    fireEvent.press(screen.getByText('Autre'))

    expect(analytics.logSelectDeletionReason).toHaveBeenNthCalledWith(1, 'other')
  })
})
