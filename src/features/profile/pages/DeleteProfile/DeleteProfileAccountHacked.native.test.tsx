import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render, screen } from 'tests/utils'

import { DeleteProfileAccountHacked } from './DeleteProfileAccountHacked'

describe('DeleteProfileAccountHacked', () => {
  it('should render correctly', () => {
    render(<DeleteProfileAccountHacked />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to profile on press ne pas sécuriser mon compte', async () => {
    render(<DeleteProfileAccountHacked />)
    const button = screen.getByText('Ne pas sécuriser mon compte')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Profile' })
  })

  it('should navigate to change password on press Modifier mon mot de passe', async () => {
    render(<DeleteProfileAccountHacked />)
    const button = screen.getByText('Modifier mon mot de passe')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('ChangePassword')
  })

  it('should navigate to confirm delete profile on press Susprendre mon compte', async () => {
    render(<DeleteProfileAccountHacked />)
    const button = screen.getByText('Suspendre mon compte')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('ConfirmDeleteProfile')
  })
})