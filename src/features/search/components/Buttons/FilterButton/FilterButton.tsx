import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useSearch } from 'features/search/context/SearchWrapper'
import { plural } from 'libs/plural'
import { Badge } from 'ui/components/Badge'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Filter as FilterIconDefault } from 'ui/svg/icons/Filter'
import { getSpacing } from 'ui/theme'

type Props = {
  activeFilters: number
  children?: never
}

export const FilterButton: FunctionComponent<Props> = ({ activeFilters }) => {
  const accessibilityLabel =
    activeFilters > 0
      ? plural(activeFilters, {
          one: `Voir tous les filtres\u00a0: # filtre actif`,
          other: `Voir tous les filtres\u00a0: # filtres actifs`,
        })
      : 'Voir tous les filtres'
  const { searchState, dispatch } = useSearch()
  const { params } = useRoute<UseRouteType<'Search'>>()

  const reinitFilters = useCallback(() => {
    dispatch({ type: 'SET_STATE_FROM_DEFAULT', payload: params ?? searchState })
  }, [dispatch, params, searchState])

  return (
    <StyledTouchableLink
      navigateTo={{ screen: 'SearchFilter', params }}
      onBeforeNavigate={reinitFilters}
      title={accessibilityLabel}
      accessibilityLabel={accessibilityLabel}>
      <FilterIconDefault size={24} />
      {activeFilters > 0 && <FloatingBadge value={activeFilters} testID="searchFilterBadge" />}
    </StyledTouchableLink>
  )
}

const StyledTouchableLink = styled(InternalTouchableLink)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: getSpacing(2),
  width: getSpacing(10),
  height: getSpacing(10),
})

const FloatingBadge = styled(Badge)({
  position: 'absolute',
  right: 0,
  bottom: 0,
})
