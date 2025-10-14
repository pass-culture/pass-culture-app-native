import React from 'react'

import { render, screen } from 'tests/utils'

import { AccessibleTitle } from './AccessibleTitle'

describe('AccessibleTitle', () => {
  it('should expose only the text to screen readers (emoji ignored)', () => {
    render(<AccessibleTitle title="Hello 👋" />)

    expect(screen.getByLabelText('Hello')).toBeTruthy()
    expect(screen.queryByLabelText('Hello 👋')).toBeNull()
    expect(screen.queryByText('Hello 👋')).toBeNull()
  })
})
