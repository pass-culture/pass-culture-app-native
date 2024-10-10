import React from 'react'

import { render, screen } from 'tests/utils'

import { CineBlockSkeleton } from './CineBlockSkeleton'

describe('<CineBlockSkeleton />', () => {
  it('should render the CineBlockSkeleton component', () => {
    render(<CineBlockSkeleton />)

    expect(screen.getByTestId('cine-block-skeleton')).toBeOnTheScreen()
  })
})
