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
      <RoundContainer>
        <FilterIconDefault size={16} />
      </RoundContainer>
      {activeFilters > 0 && <FloatingBadge value={activeFilters} testID="searchFilterBadge" />}
    </StyledTouchableLink>
  )
}

const StyledTouchableLink = styled(InternalTouchableLink)({
  display: 'flex',
  width: getSpacing(8),
  height: getSpacing(8),
})

const RoundContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  width: getSpacing(8),
  height: getSpacing(8),
  borderRadius: getSpacing(4),
  borderWidth: 1,
})

const FloatingBadge = styled(Badge)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  backgroundColor: theme.colors.black,
}))
