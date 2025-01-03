import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { render, screen } from 'tests/utils'

import { BaseTextInput } from './BaseTextInput'

describe('<BaseTextInput />', () => {
  it('should render ref correctly', () => {
    const ref = React.createRef<RNTextInput>()
    render(<BaseTextInput placeholder="placeholder" value="value" ref={ref} />)

    expect(ref.current).toBeTruthy()
  })

  it('should replicate autoFocus behaviour by calling focus() on mount when prop autoFocus is true', () => {
    const ref = React.createRef<RNTextInput>()
    render(<BaseTextInput autoFocus placeholder="placeholder" value="value" ref={ref} />)

    const nativeTextInput = screen.getByPlaceholderText('placeholder')

    expect(nativeTextInput.props.autoFocus).toBe(undefined)
    expect(ref.current?.focus).toHaveBeenCalledTimes(1)
  })

  it('should use default value when provided', () => {
    render(<BaseTextInput defaultValue="defaultValue" />)

    expect(screen.getByDisplayValue('defaultValue')).toBeTruthy()
  })
})
