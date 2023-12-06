import React from 'react'

import { render, screen } from 'tests/utils'
import { InformationTags } from 'ui/InformationTags/InformationTags'

const tags = ['Tag1', 'Tag2', 'Tag3']

describe('OfferTags component', () => {
  it('should display tags correctly', () => {
    render(<InformationTags tags={tags} />)

    expect(screen.getByText('Tag1')).toBeOnTheScreen()
    expect(screen.getByText('Tag2')).toBeOnTheScreen()
    expect(screen.getByText('Tag3')).toBeOnTheScreen()
  })

  it('should display tags within the specified number of lines', () => {
    const tagsLines = 2
    render(<InformationTags tags={tags} tagsLines={tagsLines} />)

    expect(screen.getByTestId('tagsContainer')).toHaveStyle({
      maxHeight: 56,
    })
  })
})
