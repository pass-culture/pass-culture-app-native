import React from 'react'

import { render, waitFor } from 'tests/utils/web'

import { FilterButton } from './FilterButton'

describe('FilterButton', () => {
  it('should contains the number of active filters', async () => {
    const { getByTestId } = render(<FilterButton activeFilters={2} />)

    await waitFor(() => {
      expect(getByTestId('searchFilterButton')).toHaveTextContent('2')
    })
  })

  it('should not display badge when there are no active filters', async () => {
    const { queryByTestId } = render(<FilterButton activeFilters={0} />)

    await waitFor(() => {
      expect(queryByTestId('searchFilterBadge')).toBeNull()
    })
  })

  it('should have an accessible label with the number of active filters', async () => {
    const { getByTestId } = render(<FilterButton activeFilters={2} />)

    await waitFor(() => {
      expect(getByTestId('searchFilterButton').getAttribute('aria-label')).toEqual(
        'Voir tous les filtres\u00a0: 2 filtres actifs'
      )
    })
  })

  it('should have an accessible label with one active filter', async () => {
    const { getByTestId } = render(<FilterButton activeFilters={1} />)

    await waitFor(() => {
      expect(getByTestId('searchFilterButton').getAttribute('aria-label')).toEqual(
        'Voir tous les filtres\u00a0: 1 filtre actif'
      )
    })
  })
})
