import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { render } from 'tests/utils/web'

import { TextInput } from './TextInput'

const NormalStateTextInput = <TextInput placeholder="placeholder" onChangeText={doNothingFn} />

describe('<TextInput />', () => {
  it('should render correctly when NOT focused', () => {
    const instance = render(NormalStateTextInput)

    expect(instance).toMatchSnapshot()
  })

  // FIXME: Web integration
  it.skip('should render correctly when focused [Web integration]', () => {
    // const notFocusedInstance = render(NormalStateTextInput)
    // const focusedInstance = render(NormalStateTextInput)
    //
    // const input = focusedInstance.getByPlaceholderText('placeholder')
    // fireEvent(input, 'focus')
    //
    // expect(notFocusedInstance).toMatchDiffSnapshot(focusedInstance)
  })

  it('should render ref correctly', () => {
    const myRef = React.createRef<RNTextInput>()
    render(<TextInput placeholder="placeholder" onChangeText={doNothingFn} ref={myRef} />)

    expect(myRef.current).toBeTruthy()
  })

  it('should render correctly when in error', () => {
    const notErrorInstance = render(NormalStateTextInput)
    const errorInstance = render(
      <TextInput isError={true} placeholder="placeholder" onChangeText={doNothingFn} />
    )

    expect(notErrorInstance).toMatchDiffSnapshot(errorInstance)
  })
})

function doNothingFn() {
  /* do nothing */
}
