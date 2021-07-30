import React from 'react'

import { render } from 'tests/utils'

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
    const imageHeight = getByTestId('image-container').props.style[1].height
    const imageWidth = getByTestId('image-container')?.props.style[1].width
    expect(imageHeight).toBeGreaterThan(imageWidth)
  })

  it('show an landscape image when isLandscapeHero is true', () => {
    const { getByTestId } = render(<Hero imageUrl={''} isLandscapeHero />)
    const imageHeight = getByTestId('image-container').props.style[1].height
    const imageWidth = getByTestId('image-container')?.props.style[1].width
    expect(imageWidth).toBeGreaterThan(imageHeight)
  })

  it('show an background with smaller height when isLandscapeHero is true than default background', () => {
    const defaultHero = render(<Hero imageUrl={''} />)
    const landscapeHero = render(<Hero imageUrl={''} isLandscapeHero />)

    const backgroundHeightDefaultHero = defaultHero.queryByTestId('BackgroundPlaceholder')?.props
      .height
    const backgroundHeightLandscapeHero = landscapeHero.queryByTestId('BackgroundPlaceholder')
      ?.props.height

    expect(backgroundHeightDefaultHero).toBeGreaterThan(backgroundHeightLandscapeHero)
  })
})
