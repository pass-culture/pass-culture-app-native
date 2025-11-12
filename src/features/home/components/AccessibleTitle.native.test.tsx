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

  it('should expose only the text of accessibility label to screen readers (emoji ignored)', () => {
    render(<AccessibleTitle title="Hello 👋" accessibilityLabel="Média vidéo : Hello 👋" />)

    expect(screen.getByLabelText('Média vidéo : Hello')).toBeTruthy()
    expect(screen.queryByLabelText('Média vidéo : Hello 👋')).toBeNull()
    expect(screen.queryByText('Hello 👋')).toBeNull()
  })
})
