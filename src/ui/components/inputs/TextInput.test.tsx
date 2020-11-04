import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { TextInput } from './TextInput'

const NormalStateTextInput = <TextInput placeholder="placeholder" onChangeText={doNothingFn} />

describe('<TextInput />', () => {
  it('should render correctly when NOT focused', () => {
    const instance = render(NormalStateTextInput)

    expect(instance).toMatchSnapshot()
  })

  it('should render correctly when focused', () => {
    const notFocusedInstance = render(NormalStateTextInput)
    const focusedInstance = render(NormalStateTextInput)

    const input = focusedInstance.getByPlaceholderText('placeholder')
    fireEvent(input, 'focus')

    expect(notFocusedInstance).toMatchDiffSnapshot(focusedInstance)
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
