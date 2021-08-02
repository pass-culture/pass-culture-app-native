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

  it('shows both placeholders when url is undefined', () => {
    // @ts-ignore : for test purpose
    const { queryByTestId } = render(<Hero imageUrl={undefined} />)
    expect(queryByTestId('BackgroundPlaceholder')).toBeTruthy()
    expect(queryByTestId('categoryIcon')).toBeTruthy()
    expect(queryByTestId('imagePlaceholder')).toBeTruthy()
  })

  it('does not show placeholders when an url is defined', () => {
    const { queryByTestId } = render(<Hero imageUrl={'some_url_to_some_resource'} />)
    expect(queryByTestId('BackgroundPlaceholder')).toBeFalsy()
    expect(queryByTestId('categoryIcon')).toBeFalsy()
    expect(queryByTestId('imagePlaceholder')).toBeFalsy()
  })

  it('show an portrait image by default (landscape is false)', () => {
    const { getByTestId } = render(<Hero imageUrl={''} />)
    const imageHeight = getByTestId('image-container').props.style[1].height
    const imageWidth = getByTestId('image-container')?.props.style[1].width
    expect(imageHeight).toBeGreaterThan(imageWidth)
  })

  it('show an landscape image when landscape is true', () => {
    const { getByTestId } = render(<Hero imageUrl={''} landscape />)
    const imageHeight = getByTestId('image-container').props.style[1].height
    const imageWidth = getByTestId('image-container')?.props.style[1].width
    expect(imageWidth).toBeGreaterThan(imageHeight)
  })

  it('show an background with smaller height when landscape is true than default background', () => {
    const defaultHero = render(<Hero imageUrl={''} />)
    const landscapeHero = render(<Hero imageUrl={''} landscape />)

    const backgroundHeightDefaultHero = defaultHero.queryByTestId('BackgroundPlaceholder')?.props
      .height
    const backgroundHeightLandscapeHero = landscapeHero.queryByTestId('BackgroundPlaceholder')
      ?.props.height

    expect(backgroundHeightDefaultHero).toBeGreaterThan(backgroundHeightLandscapeHero)
  })
})
