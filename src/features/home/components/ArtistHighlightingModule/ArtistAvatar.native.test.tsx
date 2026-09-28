import React from 'react'

import { ArtistAvatar } from 'features/home/components/ArtistHighlightingModule/ArtistAvatar'
import { render, screen } from 'tests/utils'

describe('<ArtistAvatar />', () => {
  it('should display artist avatar when imageURL defined', () => {
    render(<ArtistAvatar imageUrl="url" size={144} />)

    expect(screen.getByTestId('artistAvatar')).toBeOnTheScreen()
  })

  it('should display default artist avatar when imageURL not defined', () => {
    render(<ArtistAvatar size={144} />)

    expect(screen.getByTestId('defaultArtistAvatar')).toBeOnTheScreen()
  })
})
