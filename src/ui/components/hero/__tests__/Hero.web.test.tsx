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

  it('shows both placeholders when url is undefined', () => {
    // @ts-ignore : for test purpose
    const { queryByTestId } = render(<Hero imageUrl={undefined} />)
    expect(queryByTestId('BackgroundPlaceholder')).toBeTruthy()
    expect(queryByTestId('categoryIcon')).toBeTruthy()
    expect(queryByTestId('imagePlaceholder')).toBeTruthy()
  })

  // FIXME: Web Integration
  it.skip('does not show placeholders when an url is defined [Web Integration]', () => {
    const { queryByTestId } = render(<Hero imageUrl={'some_url_to_some_resource'} />)
    expect(queryByTestId('BackgroundPlaceholder')).toBeFalsy()
    expect(queryByTestId('categoryIcon')).toBeFalsy()
    expect(queryByTestId('imagePlaceholder')).toBeFalsy()
  })

  it('show an portrait image by default (landscape is false)', () => {
    const { getByTestId } = render(<Hero imageUrl={''} />)

    const imageContainer = window.getComputedStyle(getByTestId('image-container'))
    const imageWidth = parseFloat(imageContainer.width)
    const imageHeight = parseFloat(imageContainer.height)

    expect(imageHeight).toBeGreaterThan(imageWidth)
  })

  it('show an landscape image when landscape is true', () => {
    const { getByTestId } = render(<Hero imageUrl={''} landscape />)

    const imageContainer = window.getComputedStyle(getByTestId('image-container'))
    const imageWidth = parseFloat(imageContainer.width)
    const imageHeight = parseFloat(imageContainer.height)

    expect(imageWidth).toBeGreaterThan(imageHeight)
  })
})
