import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { render, screen } from 'tests/utils'

import { Hero } from '../Hero'

describe('HeroImage', () => {
  it('shows both placeholders when url is empty', () => {
    render(<Hero imageUrl="" type="offer" categoryId={CategoryIdEnum.CINEMA} />)

    expect(screen.queryByTestId('BackgroundPlaceholder')).toBeOnTheScreen()
    expect(screen.queryByTestId('categoryIcon')).toBeOnTheScreen()
    expect(screen.queryByTestId('imagePlaceholder')).toBeOnTheScreen()
  })

  it('shows both placeholders when url is undefined', () => {
    render(<Hero imageUrl={undefined} type="offer" categoryId={CategoryIdEnum.CINEMA} />)

    expect(screen.queryByTestId('BackgroundPlaceholder')).toBeOnTheScreen()
    expect(screen.queryByTestId('categoryIcon')).toBeOnTheScreen()
    expect(screen.queryByTestId('imagePlaceholder')).toBeOnTheScreen()
  })

  it('does not show placeholders when an url is defined', () => {
    render(
      <Hero imageUrl="some_url_to_some_resource" type="offer" categoryId={CategoryIdEnum.CINEMA} />
    )

    expect(screen.queryByTestId('BackgroundPlaceholder')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('categoryIcon')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('imagePlaceholder')).not.toBeOnTheScreen()
  })

  it('should not display linear gradient when shouldDisplayGradientAndTag is not defined and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
      />
    )

    expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
  })

  it('should not display tag when shouldDisplayGradientAndTag is not defined and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
      />
    )

    expect(screen.queryByTestId('image-tag')).not.toBeOnTheScreen()
  })

  it('should not display linear gradient when shouldDisplayGradientAndTag is false and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayGradientAndTag={false}
      />
    )

    expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
  })

  it('should not display tag when shouldDisplayGradientAndTag is false and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayGradientAndTag={false}
      />
    )

    expect(screen.queryByTestId('image-tag')).not.toBeOnTheScreen()
  })

  it('should display linear gradient when shouldDisplayGradientAndTag is true and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayGradientAndTag
      />
    )

    expect(screen.getByTestId('image-gradient')).toBeOnTheScreen()
  })

  it('should display tag when shouldDisplayGradientAndTag is true and url is defined', () => {
    render(
      <Hero
        imageUrl="some_url_to_some_resource"
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayGradientAndTag
      />
    )

    expect(screen.getByTestId('image-tag')).toBeOnTheScreen()
  })

  it('should not display linear gradient when shouldDisplayGradientAndTag is true and url is not defined', () => {
    render(
      <Hero
        imageUrl={undefined}
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayGradientAndTag
      />
    )

    expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
  })

  it('should not display tag when shouldDisplayGradientAndTag is true and url is not defined', () => {
    render(
      <Hero
        imageUrl={undefined}
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayGradientAndTag
      />
    )

    expect(screen.queryByTestId('image-tag')).not.toBeOnTheScreen()
  })

  it('should not display linear gradient when shouldDisplayGradientAndTag is true and url is empty', () => {
    render(
      <Hero
        imageUrl=""
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayGradientAndTag
      />
    )

    expect(screen.queryByTestId('image-gradient')).not.toBeOnTheScreen()
  })

  it('should not display tag when shouldDisplayGradientAndTag is true and url is empty', () => {
    render(
      <Hero
        imageUrl=""
        type="offerv2"
        categoryId={CategoryIdEnum.CINEMA}
        shouldDisplayGradientAndTag
      />
    )

    expect(screen.queryByTestId('image-tag')).not.toBeOnTheScreen()
  })
})
