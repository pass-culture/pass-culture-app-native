import React from 'react'

import { render, screen } from 'tests/utils'

import { InputError } from './InputError'

describe('InputError Component', () => {
  it('should display the given message', () => {
    render(
      <InputError
        visible
        errorMessage="message"
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
        errorMessage="message"
        numberOfSpacesTop={1}
        relatedInputId="relatedInputId"
      />
    )

    const text = screen.queryByText('message')

    expect(text).not.toBeOnTheScreen()
  })
})
