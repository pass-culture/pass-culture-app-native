import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { PasswordInput } from './PasswordInput'

describe('<PasswordInput />', () => {
  it('should render correctly', () => {
    const instance = render(<PasswordInput />)

    expect(instance).toMatchSnapshot()
  })

  it('should render correctly when password is displayed', () => {
    const instance = render(<PasswordInput width={300} height={50} />)
    const hiddenSnapshot = instance.toJSON()

    const eyeSlashIcon = instance.getByTestId('eye-slash')
    fireEvent.press(eyeSlashIcon)

    const displayPasswordSnapshot = instance.toJSON()

    expect(displayPasswordSnapshot).toMatchDiffSnapshot(hiddenSnapshot)
  })

  it('should render correctly when password is hidden after it was displayed', () => {
    const instance = render(<PasswordInput width={300} height={50} />)

    const eyeSlashIcon = instance.getByTestId('eye-slash')
    fireEvent.press(eyeSlashIcon)

    const displayPasswordSnapshot = instance.toJSON()

    const eyeIcon = instance.getByTestId('eye')
    fireEvent.press(eyeIcon)

    const hiddenPasswordSnapshot = instance.toJSON()

    expect(hiddenPasswordSnapshot).toMatchDiffSnapshot(displayPasswordSnapshot)
  })
})
