import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render, screen } from 'tests/utils'

import { DeleteProfileAccountNotDeletable } from './DeleteProfileAccountNotDeletable'

jest.mock('libs/firebase/analytics/analytics')

describe('DeleteProfileAccountNotDeletable', () => {
  it('should render correctly', () => {
    render(<DeleteProfileAccountNotDeletable />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to profile on press Retourner sur mon profil', async () => {
    render(<DeleteProfileAccountNotDeletable />)
    const button = screen.getByText('Retourner sur mon profil')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Profile' })
  })

  it('should navigate to notifications settings on press Désactiver mes notifications', async () => {
    render(<DeleteProfileAccountNotDeletable />)
    const button = screen.getByText('Désactiver mes notifications')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('NotificationsSettings')
  })
})
