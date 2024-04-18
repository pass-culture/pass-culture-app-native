import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { render, screen } from 'tests/utils'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'

const props = {
  title: 'Harry Potter et l’ordre du phénix',
  categoryId: CategoryIdEnum.CINEMA,
  imageUrl:
    'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
  distanceToOffer: '',
  subtitles: ['Séances de cinéma', '14 avril 2024'],
  price: '120€',
}

describe('HorizontalTile Component', () => {
  it('should render correctly', () => {
    render(<HorizontalTile {...props} />)

    expect(screen).toMatchSnapshot()
  })
})
