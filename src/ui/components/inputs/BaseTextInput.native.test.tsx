import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { render } from 'tests/utils'

import { BaseTextInput } from './BaseTextInput'

describe('<BaseTextInput />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<BaseTextInput placeholder={'placeholder'} value={'value'} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render ref correctly', () => {
    const ref = React.createRef<RNTextInput>()
    render(<BaseTextInput placeholder="placeholder" value={'value'} ref={ref} />)

    expect(ref.current).toBeTruthy()
  })

  it('should replicate autoFocus behaviour by calling focus() on mount when prop autoFocus is true', () => {
    const ref = React.createRef<RNTextInput>()
    const renderAPI = render(
      <BaseTextInput autoFocus={true} placeholder={'placeholder'} value={'value'} ref={ref} />
    )

    const nativeTextInput = renderAPI.getByPlaceholderText('placeholder')

    expect(nativeTextInput.props.autoFocus).toBe(undefined)
    expect(ref.current?.focus).toBeCalledTimes(1)
  })
})
