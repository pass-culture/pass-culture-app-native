import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { getNavigateToConfig } from 'features/navigation/SearchStackNavigator/helpers'
import { SearchView } from 'features/search/types'
import { userEvent, render, screen } from 'tests/utils'

import { FilterButton } from './FilterButton'

const user = userEvent.setup()
jest.useFakeTimers()

describe('FilterButton', () => {
  it('should contains the number of active filters', () => {
    render(<FilterButton activeFilters={2} navigateTo={getNavigateToConfig(SearchView.Filter)} />)

    expect(screen.getByText('2')).toBeOnTheScreen()
  })

  it('should not display badge when there are no active filters', () => {
    render(<FilterButton activeFilters={0} navigateTo={getNavigateToConfig(SearchView.Filter)} />)

    expect(screen.queryByTestId('searchFilterBadge')).not.toBeOnTheScreen()
  })

  it('should navigate with undefined params when pressing filter button', async () => {
    render(<FilterButton activeFilters={1} navigateTo={getNavigateToConfig(SearchView.Filter)} />)

    const filterButton = screen.getByTestId('searchFilterBadge')
    await user.press(filterButton)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: { params: undefined, screen: 'SearchFilter' },
      screen: 'SearchStackNavigator',
    })
  })

  describe('Accessibility', () => {
    it('should have an accessible label with the number of active filters', () => {
      render(<FilterButton activeFilters={2} navigateTo={getNavigateToConfig(SearchView.Filter)} />)

      expect(
        screen.getByLabelText('Voir tous les filtres\u00a0: 2 filtres actifs')
      ).toBeOnTheScreen()
    })

    it('should have an accessible label with one active filter', () => {
      render(<FilterButton activeFilters={1} navigateTo={getNavigateToConfig(SearchView.Filter)} />)

      expect(screen.getByLabelText('Voir tous les filtres\u00a0: 1 filtre actif')).toBeOnTheScreen()
    })

    it('should have an accessible label without active filter', () => {
      render(<FilterButton activeFilters={0} navigateTo={getNavigateToConfig(SearchView.Filter)} />)

      expect(screen.getByLabelText('Voir tous les filtres')).toBeOnTheScreen()
    })
  })
})
