import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { render, screen, userEvent } from 'tests/utils'

import { PasswordInput } from './PasswordInput'

const user = userEvent.setup()
jest.useFakeTimers()

describe('<PasswordInput />', () => {
  it('should change accessibilityLabel when password is hidden or it was displayed', async () => {
    render(<PasswordInput autocomplete="new-password" />)

    expect(screen.getByLabelText('Afficher le mot de passe')).toBeOnTheScreen()
    expect(screen.queryByLabelText('Cacher le mot de passe')).not.toBeOnTheScreen()

    const switchPasswordVisibilityButton = screen.getByTestId('Afficher le mot de passe')

    await user.press(switchPasswordVisibilityButton)

    expect(screen.getByLabelText('Cacher le mot de passe')).toBeOnTheScreen()
    expect(screen.queryByLabelText('Afficher le mot de passe')).not.toBeOnTheScreen()
  })

  it('should render ref correctly', () => {
    const myRef = React.createRef<RNTextInput>()
    render(<PasswordInput ref={myRef} autocomplete="new-password" />)

    expect(myRef.current).toBeTruthy()
  })
})
