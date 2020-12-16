import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { PasswordInput } from './PasswordInput'

describe('<PasswordInput />', () => {
  it('should render correctly', () => {
    const instance = render(<PasswordInput />)

    expect(instance).toMatchSnapshot()
  })

  it('should render correctly when password is displayed', () => {
    const instance = render(<PasswordInput />)
    const hiddenSnapshot = instance.toJSON()

    const eyeSlashIcon = instance.getByTestId('eye-slash')
    fireEvent.press(eyeSlashIcon)

    const displayPasswordSnapshot = instance.toJSON()

    expect(displayPasswordSnapshot).toMatchDiffSnapshot(hiddenSnapshot)
  })

  it('should render correctly when password is hidden after it was displayed', () => {
    const instance = render(<PasswordInput />)

    const eyeSlashIcon = instance.getByTestId('eye-slash')
    fireEvent.press(eyeSlashIcon)

    const displayPasswordSnapshot = instance.toJSON()

    const eyeIcon = instance.getByTestId('eye')
    fireEvent.press(eyeIcon)

    const hiddenPasswordSnapshot = instance.toJSON()

    expect(hiddenPasswordSnapshot).toMatchDiffSnapshot(displayPasswordSnapshot)
  })

  it('should render ref correctly', () => {
    const myRef = React.createRef<RNTextInput>()
    render(<PasswordInput ref={myRef} />)

    expect(myRef.current).toBeTruthy()
  })
})
