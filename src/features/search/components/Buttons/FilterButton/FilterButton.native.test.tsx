import React from 'react'

import { fireEvent, render, waitFor } from 'tests/utils'

import { FilterButton } from './FilterButton'

const mockDispatch = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ dispatch: mockDispatch }),
}))

describe('FilterButton', () => {
  it('should contains the number of active filters', async () => {
    const { queryByText } = render(<FilterButton activeFilters={2} />)

    await waitFor(() => {
      expect(queryByText('2')).toBeTruthy()
    })
  })

  it('should not display badge when there are no active filters', async () => {
    const { queryByTestId } = render(<FilterButton activeFilters={0} />)

    await waitFor(() => {
      expect(queryByTestId('searchFilterBadge')).toBeNull()
    })
  })

  it('should reset filters when pressing filter button', async () => {
    const { getByTestId } = render(<FilterButton activeFilters={1} />)

    const filterButton = getByTestId('searchFilterBadge')
    fireEvent.press(filterButton)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE_FROM_DEFAULT',
        payload: expect.any(Object),
      })
    })
  })

  describe('Accessibility', () => {
    it('should have an accessible label with the number of active filters', async () => {
      const { queryByLabelText } = render(<FilterButton activeFilters={2} />)

      await waitFor(() => {
        expect(queryByLabelText('Voir tous les filtres\u00a0: 2 filtres actifs')).toBeTruthy()
      })
    })

    it('should have an accessible label with one active filter', async () => {
      const { queryByLabelText } = render(<FilterButton activeFilters={1} />)

      await waitFor(() => {
        expect(queryByLabelText('Voir tous les filtres\u00a0: 1 filtre actif')).toBeTruthy()
      })
    })

    it('should have an accessible label without active filter', async () => {
      const { queryByLabelText } = render(<FilterButton activeFilters={0} />)

      await waitFor(() => {
        expect(queryByLabelText('Voir tous les filtres')).toBeTruthy()
      })
    })
  })
})
