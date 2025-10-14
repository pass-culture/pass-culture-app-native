import React from 'react'

import { render, screen } from 'tests/utils/web'

import { AccessibleTitle } from './AccessibleTitle'

describe('AccessibleTitle', () => {
  it('should expose only the text to screen readers (emoji ignored)', () => {
    render(<AccessibleTitle title="Hello 👋" />)

    const emoji = screen.getByText('👋')

    expect(emoji).toBeInTheDocument()
    expect(emoji).toHaveAttribute('aria-hidden', 'true')

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.queryByText('Hello 👋')).toBeNull()
  })
})
