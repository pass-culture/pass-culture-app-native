import React from 'react'

import { Tab } from 'features/favorites/types'
import { render, screen } from 'tests/utils'

import { NumberOfResults } from './NumberOfResults'

describe('NumberOfResults component', () => {
  it('should not display when having no favorites', () => {
    const { toJSON } = render(<NumberOfResults nbFavorites={0} />)

    expect(toJSON()).not.toBeOnTheScreen()
  })

  it('should display the number of favorites when singular', () => {
    render(<NumberOfResults nbFavorites={1} />)

    expect(screen.getByText('1 favori')).toBeOnTheScreen()
  })

  it('should display the number of favorites with tab when singular', () => {
    render(<NumberOfResults nbFavorites={1} tab={Tab.OFFERS} />)

    expect(screen.getByText('1 offre en favori')).toBeOnTheScreen()
  })

  it('should display the number of favorites when plural', () => {
    render(<NumberOfResults nbFavorites={2} />)

    expect(screen.getByText('2 favoris')).toBeOnTheScreen()
  })

  it('should display the number of favorites with tab when plural', () => {
    render(<NumberOfResults nbFavorites={2} tab={Tab.OFFERS} />)

    expect(screen.getByText('2 offres en favoris')).toBeOnTheScreen()
  })

  it('should display the number of favorites when more than 1 000', () => {
    render(<NumberOfResults nbFavorites={1234} />)

    expect(screen.getByText('1 234 favoris')).toBeOnTheScreen()
  })
})
