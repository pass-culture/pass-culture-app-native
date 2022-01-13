import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { fireEvent, render } from 'tests/utils'

import { PasswordInput } from './PasswordInput'

describe('<PasswordInput />', () => {
  it('should change accessibilityLabel when password is hidden or it was displayed', () => {
    const instance = render(<PasswordInput />)

    expect(instance.queryByLabelText('Afficher le mot de passe')).toBeTruthy()
    expect(instance.queryByLabelText('Cacher le mot de passe')).toBeFalsy()

    const switchPasswordVisibilityButton = instance.getByTestId('toggle-password-visibility')

    fireEvent.press(switchPasswordVisibilityButton)
    expect(instance.queryByLabelText('Cacher le mot de passe')).toBeTruthy()
    expect(instance.queryByLabelText('Afficher le mot de passe')).toBeFalsy()
  })

  it('should render ref correctly', () => {
    const myRef = React.createRef<RNTextInput>()
    render(<PasswordInput ref={myRef} />)
    expect(myRef.current).toBeTruthy()
  })
})
