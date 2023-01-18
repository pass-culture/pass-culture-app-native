import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { fireEvent, render, waitFor } from 'tests/utils'

import { FilterButton } from './FilterButton'

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

  it('should navigate with url params filters when pressing filter button', async () => {
    useRoute.mockReturnValueOnce({
      params: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
    })
    const { getByTestId } = render(<FilterButton activeFilters={1} />)

    const filterButton = getByTestId('searchFilterBadge')
    fireEvent.press(filterButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SearchFilter', {
        offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE],
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
