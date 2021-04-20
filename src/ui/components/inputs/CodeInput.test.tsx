import React from 'react'

import { render } from 'tests/utils'

import { CodeInput } from './CodeInput'

describe('CodeInput', () => {
  it.each([1, 2, 3])('should be contain the right number of inputs', (length) => {
    const { getByTestId } = render(<CodeInput codeLength={length} />)

    const container = getByTestId('code-input-container')

    expect(container.props.children.length).toEqual(length)
  })
  it.each([
    [0, true],
    [1, false],
    [2, false],
  ])('should pass the autofocus only to the first input', (inputIndex, expectedAutoFocus) => {
    const { getByTestId } = render(<CodeInput codeLength={3} autoFocus />)

    const container = getByTestId('code-input-container')
    const input = container.props.children[inputIndex]

    expect(input.props.autoFocus).toBe(expectedAutoFocus)
  })
})
