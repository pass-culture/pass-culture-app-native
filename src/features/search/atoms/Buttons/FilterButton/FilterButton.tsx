import { plural } from '@lingui/macro'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { Badge } from 'ui/components/Badge'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Filter as FilterIconDefault } from 'ui/svg/icons/Filter'

type Props = {
  activeFilters: number
  children?: never
}

export const FilterButton: FunctionComponent<Props> = ({ activeFilters }) => {
  const accessibilityLabel = plural(activeFilters, {
    one: `Voir tous les filtres\u00a0: # filtre actif`,
    other: `Voir tous les filtres\u00a0: # filtres actifs`,
  })
  const { searchState } = useSearch()
  const { dispatch } = useStagedSearch()

  const reinitFilters = useCallback(() => {
    dispatch({ type: 'SET_STATE', payload: searchState })
  }, [dispatch, searchState])

  return (
    <TouchableLink
      navigateTo={{ screen: 'SearchFilter' }}
      onPress={reinitFilters}
      testID="searchFilterButton"
      accessibilityLabel={accessibilityLabel}
      title={accessibilityLabel}>
      <FilterIconDefault />
      {activeFilters > 0 && <FloatingBadge value={activeFilters} testID="searchFilterBadge" />}
    </TouchableLink>
  )
}

const FloatingBadge = styled(Badge)({
  position: 'absolute',
  right: 0,
  bottom: 0,
})
