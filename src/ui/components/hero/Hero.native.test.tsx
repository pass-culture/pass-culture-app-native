import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { render, screen } from 'tests/utils'

import { Hero } from './Hero'

describe('HeroImage', () => {
  it('should not display linear gradient when shouldDisplayOfferPreview is not defined and url is defined', () => {
    render(<Hero imageUrl="some_url_to_some_resource" categoryId={CategoryIdEnum.CINEMA} />)

    expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
  })

  it('should not display tag when shouldDisplayOfferPreview is not defined and url is defined', () => {
    render(<Hero imageUrl="some_url_to_some_resource" categoryId={CategoryIdEnum.CINEMA} />)

    expect(screen.queryByTestId('image-tag')).not.toBeOnTheScreen()
  })

  it('should not display linear gradient when shouldDisplayOfferPreview is false and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayOfferPreview={false}
      />
    )

    expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
  })

  it('should not display tag when shouldDisplayOfferPreview is false and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayOfferPreview={false}
      />
    )

    expect(screen.queryByTestId('image-tag')).not.toBeOnTheScreen()
  })

  it('should display linear gradient when shouldDisplayOfferPreview is true and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayOfferPreview
      />
    )

    expect(screen.getByTestId('image-gradient')).toBeOnTheScreen()
  })

  it('should display tag when shouldDisplayOfferPreview is true and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayOfferPreview
      />
    )

    expect(screen.getByTestId('image-tag')).toBeOnTheScreen()
  })

  it('should not display linear gradient when shouldDisplayOfferPreview is true and url is not defined', () => {
    render(
      <Hero imageUrl={undefined} categoryId={CategoryIdEnum.CINEMA} shouldDisplayOfferPreview />
    )

    expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
  })

  it('should not display tag when shouldDisplayOfferPreview is true and url is not defined', () => {
    render(
      <Hero imageUrl={undefined} categoryId={CategoryIdEnum.CINEMA} shouldDisplayOfferPreview />
    )

    expect(screen.queryByTestId('image-tag')).not.toBeOnTheScreen()
  })

  it('should not display linear gradient when shouldDisplayOfferPreview is true and url is empty', () => {
    render(<Hero imageUrl="" categoryId={CategoryIdEnum.CINEMA} shouldDisplayOfferPreview />)

    expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
  })

  it('should not display tag when shouldDisplayOfferPreview is true and url is empty', () => {
    render(<Hero imageUrl="" categoryId={CategoryIdEnum.CINEMA} shouldDisplayOfferPreview />)

    expect(screen.queryByTestId('image-tag')).not.toBeOnTheScreen()
  })
})
