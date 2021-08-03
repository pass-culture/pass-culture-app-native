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
})
