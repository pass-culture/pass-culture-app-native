import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { render, screen } from 'tests/utils'

import { TextInput } from './TextInput'

const NormalStateTextInput = (
  <TextInput placeholder="placeholder" defaultValue="defaultValue" onChangeText={doNothingFn} />
)

describe('<TextInput />', () => {
  it('should render correctly when NOT focused', () => {
    render(NormalStateTextInput)

    expect(screen).toMatchSnapshot()
  })

  it('should render ref correctly', () => {
    const myRef = React.createRef<RNTextInput>()
    render(<TextInput placeholder="placeholder" onChangeText={doNothingFn} ref={myRef} />)

    expect(myRef.current).toBeTruthy()
  })
})

function doNothingFn() {
  /* do nothing */
}
