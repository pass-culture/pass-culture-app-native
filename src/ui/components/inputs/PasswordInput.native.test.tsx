import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { fireEvent, render, screen } from 'tests/utils'

import { PasswordInput } from './PasswordInput'

describe('<PasswordInput />', () => {
  it('should change accessibilityLabel when password is hidden or it was displayed', () => {
    render(<PasswordInput />)

    expect(screen.queryByLabelText('Afficher le mot de passe')).toBeOnTheScreen()
    expect(screen.queryByLabelText('Cacher le mot de passe')).not.toBeOnTheScreen()

    const switchPasswordVisibilityButton = screen.getByTestId('Afficher le mot de passe')

    fireEvent.press(switchPasswordVisibilityButton)
    expect(screen.queryByLabelText('Cacher le mot de passe')).toBeOnTheScreen()
    expect(screen.queryByLabelText('Afficher le mot de passe')).not.toBeOnTheScreen()
  })

  it('should render ref correctly', () => {
    const myRef = React.createRef<RNTextInput>()
    render(<PasswordInput ref={myRef} />)
    expect(myRef.current).toBeTruthy()
  })
})
