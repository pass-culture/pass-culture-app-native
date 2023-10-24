import React from 'react'

import { render, screen } from 'tests/utils'

import { InputError } from './InputError'

describe('InputError Component', () => {
  it('should display the given message', () => {
    render(
      <InputError
        visible
        messageId="message"
        numberOfSpacesTop={1}
        relatedInputId="relatedInputId"
      />
    )

    const text = screen.queryByText('message')

    expect(text).toBeOnTheScreen()
  })

  it('should hide the given message', () => {
    render(
      <InputError
        visible={false}
        messageId="message"
        numberOfSpacesTop={1}
        relatedInputId="relatedInputId"
      />
    )

    const text = screen.queryByText('message')

    expect(text).not.toBeOnTheScreen()
  })

  it('should display the right top space', () => {
    render(
      <InputError
        visible
        messageId="message"
        numberOfSpacesTop={1}
        relatedInputId="relatedInputId"
      />
    )

    const spacer = screen.getByTestId('input-error-top-spacer')

    expect(spacer.props.numberOfSpaces).toEqual(1)
  })
})
