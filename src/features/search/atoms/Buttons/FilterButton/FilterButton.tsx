import { plural } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Badge } from 'ui/components/Badge'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Filter as FilterIconDefault } from 'ui/svg/icons/Filter'

type Props = {
  activeFilters: number
  children?: never
}

export const FilterButton: FunctionComponent<Props> = ({ activeFilters, ...props }) => {
  const accessibilityLabel = plural(activeFilters, {
    one: `Voir tous les filtres\u00a0: # filtre actif`,
    other: `Voir tous les filtres\u00a0: # filtres actifs`,
  })

  return (
    <TouchableLink
      {...props}
      navigateTo={{ screen: 'SearchFilter' }}
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
