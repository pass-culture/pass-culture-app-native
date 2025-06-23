import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { plural } from 'libs/plural'
import { Badge } from 'ui/components/Badge'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'
import { Filter as FilterIcon } from 'ui/svg/icons/Filter'
import { getSpacing } from 'ui/theme'

type Props = {
  activeFilters?: number
  children?: never
  navigateTo?: InternalTouchableLinkProps['navigateTo']
}

export const FilterButton: FunctionComponent<Props> = ({ activeFilters = 0, navigateTo }) => {
  const accessibilityLabel =
    activeFilters > 0
      ? plural(activeFilters, {
          singular: `Voir tous les filtres\u00a0: # filtre actif`,
          plural: `Voir tous les filtres\u00a0: # filtres actifs`,
        })
      : 'Voir tous les filtres'

  return (
    <StyledTouchableLink
      navigateTo={navigateTo}
      title={accessibilityLabel}
      accessibilityLabel={accessibilityLabel}>
      <RoundContainer>
        <StyledFilterIcon />
      </RoundContainer>
      {activeFilters > 0 ? (
        <FloatingBadge value={activeFilters} testID="searchFilterBadge" />
      ) : null}
    </StyledTouchableLink>
  )
}

const StyledTouchableLink = styled(InternalTouchableLink)({
  display: 'flex',
  width: getSpacing(8),
  height: getSpacing(8),
})

const RoundContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: getSpacing(8),
  height: getSpacing(8),
  borderRadius: getSpacing(4),
  borderWidth: 1,
  borderColor: theme.designSystem.color.border.default,
}))

const StyledFilterIcon = styled(FilterIcon).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const FloatingBadge = styled(Badge)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  backgroundColor: theme.designSystem.color.background.inverted,
}))
