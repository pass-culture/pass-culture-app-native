import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { fireEvent, render } from 'tests/utils'

import { PasswordInput } from './PasswordInput'

describe('<PasswordInput />', () => {
  it('should change accessibilityLabel when password is hidden or it was displayed', () => {
    const { queryByLabelText, getByTestId } = render(<PasswordInput />)

    expect(queryByLabelText('Afficher le mot de passe')).toBeTruthy()
    expect(queryByLabelText('Cacher le mot de passe')).toBeNull()

    const switchPasswordVisibilityButton = getByTestId('toggle-password-visibility')

    fireEvent.press(switchPasswordVisibilityButton)
    expect(queryByLabelText('Cacher le mot de passe')).toBeTruthy()
    expect(queryByLabelText('Afficher le mot de passe')).toBeNull()
  })

  it('should render ref correctly', () => {
    const myRef = React.createRef<RNTextInput>()
    render(<PasswordInput ref={myRef} />)
    expect(myRef.current).toBeTruthy()
  })
})
