import React from 'react'

import { render } from 'tests/utils/web'

import { Hero } from '../Hero'

describe('HeroImage', () => {
  it('shows both placeholders when url is empty', () => {
    const { queryByTestId } = render(<Hero imageUrl={''} />)
    expect(queryByTestId('BackgroundPlaceholder')).toBeTruthy()
    expect(queryByTestId('categoryIcon')).toBeTruthy()
    expect(queryByTestId('imagePlaceholder')).toBeTruthy()
  })

  it('show an portrait image by default (isLandscapeHero is false)', () => {
    const { getByTestId } = render(<Hero imageUrl={''} />)

    const imageContainer = window.getComputedStyle(getByTestId('image-container'))
    const imageWidth = parseFloat(imageContainer.width)
    const imageHeight = parseFloat(imageContainer.height)

    expect(imageHeight).toBeGreaterThan(imageWidth)
  })

  it('show an landscape image when isLandscapeHero is true', () => {
    const { getByTestId } = render(<Hero imageUrl={''} isLandscapeHero />)

    const imageContainer = window.getComputedStyle(getByTestId('image-container'))
    const imageWidth = parseFloat(imageContainer.width)
    const imageHeight = parseFloat(imageContainer.height)

    expect(imageWidth).toBeGreaterThan(imageHeight)
  })
})
