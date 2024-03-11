import React from 'react'

import { render, screen } from 'tests/utils'

import { Loader } from './Loader'

describe('Loader', () => {
  it('should display the message use in parameter', () => {
    render(<Loader message="En cours de chargement..." />)

    expect(screen.getByText('En cours de chargement...')).toBeOnTheScreen()
  })
})
