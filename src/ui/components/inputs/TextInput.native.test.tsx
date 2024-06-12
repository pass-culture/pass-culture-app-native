import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { render } from 'tests/utils'

import { TextInput } from './TextInput'

describe('<TextInput />', () => {
  it('should render ref correctly', () => {
    const myRef = React.createRef<RNTextInput>()
    render(<TextInput placeholder="placeholder" onChangeText={jest.fn()} ref={myRef} />)

    expect(myRef.current).toBeTruthy()
  })
})
