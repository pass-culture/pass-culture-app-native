import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { render, screen } from 'tests/utils/web'

import { Hero } from '../Hero'

describe('HeroImage', () => {
  it('should not display linear gradient when enableOfferPreview is true and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
        enableOfferPreview
      />
    )

    expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
  })
})
