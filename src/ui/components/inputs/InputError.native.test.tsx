import React from 'react'

import { render, screen } from 'tests/utils'

import { InputError } from './InputError'

describe('InputError Component', () => {
  it('should display the given message', () => {
    render(<InputError visible messageId="message" numberOfSpacesTop={1} />)

    const text = screen.getByText('message', { hidden: true })

    expect(text).toBeOnTheScreen()
  })

  it('should hide the given message', () => {
    render(<InputError visible={false} messageId="message" numberOfSpacesTop={1} />)

    const text = screen.queryByText('message', { hidden: true })

    expect(text).not.toBeOnTheScreen()
  })
})
