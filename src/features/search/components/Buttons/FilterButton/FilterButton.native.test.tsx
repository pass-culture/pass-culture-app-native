import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen } from 'tests/utils'

import { FilterButton } from './FilterButton'

const user = userEvent.setup()
jest.useFakeTimers()

describe('FilterButton', () => {
  it('should contains the number of active filters', () => {
    render(
      reactQueryProviderHOC(
        <FilterButton activeFilters={2} navigateTo={{ screen: 'SearchFilter' }} />
      )
    )

    expect(screen.getByText('2')).toBeOnTheScreen()
  })

  it('should not display badge when there are no active filters', () => {
    render(
      reactQueryProviderHOC(
        <FilterButton activeFilters={0} navigateTo={{ screen: 'SearchFilter' }} />
      )
    )

    expect(screen.queryByTestId('searchFilterBadge')).not.toBeOnTheScreen()
  })

  it('should navigate with undefined params when pressing filter button', async () => {
    render(
      reactQueryProviderHOC(
        <FilterButton activeFilters={1} navigateTo={{ screen: 'SearchFilter' }} />
      )
    )

    const filterButton = screen.getByTestId('searchFilterBadge')
    await user.press(filterButton)

    expect(navigate).toHaveBeenCalledWith('SearchFilter', undefined)
  })

  describe('Accessibility', () => {
    it('should have an accessible label with the number of active filters', () => {
      render(
        reactQueryProviderHOC(
          <FilterButton activeFilters={2} navigateTo={{ screen: 'SearchFilter' }} />
        )
      )

      expect(
        screen.getByLabelText('Voir tous les filtres\u00a0: 2 filtres actifs')
      ).toBeOnTheScreen()
    })

    it('should have an accessible label with one active filter', () => {
      render(
        reactQueryProviderHOC(
          <FilterButton activeFilters={1} navigateTo={{ screen: 'SearchFilter' }} />
        )
      )

      expect(screen.getByLabelText('Voir tous les filtres\u00a0: 1 filtre actif')).toBeOnTheScreen()
    })

    it('should have an accessible label without active filter', () => {
      render(
        reactQueryProviderHOC(
          <FilterButton activeFilters={0} navigateTo={{ screen: 'SearchFilter' }} />
        )
      )

      expect(screen.getByLabelText('Voir tous les filtres')).toBeOnTheScreen()
    })
  })
})
