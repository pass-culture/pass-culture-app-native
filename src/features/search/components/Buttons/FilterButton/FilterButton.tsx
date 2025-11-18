import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { plural } from 'libs/plural'
import { Badge } from 'ui/components/Badge'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'
import { Filter as FilterIcon } from 'ui/svg/icons/Filter'

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

  const {
    data: { displayNewSearchHeader },
  } = useRemoteConfigQuery()

  return (
    <StyledTouchableLink
      navigateTo={navigateTo}
      title={accessibilityLabel}
      displayNewSearchHeader={displayNewSearchHeader}
      accessibilityLabel={accessibilityLabel}>
      <RoundContainer displayNewSearchHeader={displayNewSearchHeader}>
        <StyledFilterIcon />
      </RoundContainer>
      {activeFilters > 0 ? (
        <FloatingBadge value={activeFilters} testID="searchFilterBadge" />
      ) : null}
    </StyledTouchableLink>
  )
}

const StyledTouchableLink = styled(InternalTouchableLink)<{
  navigateTo?: InternalTouchableLinkProps['navigateTo']
  displayNewSearchHeader?: boolean
}>(({ theme, displayNewSearchHeader }) => ({
  display: 'flex',
  width: displayNewSearchHeader ? theme.inputs.height.small : theme.designSystem.size.spacing.xxl,
  height: displayNewSearchHeader ? theme.inputs.height.small : theme.designSystem.size.spacing.xxl,
}))

const RoundContainer = styled.View<{ displayNewSearchHeader?: boolean }>(
  ({ theme, displayNewSearchHeader }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    width: displayNewSearchHeader ? theme.inputs.height.small : theme.designSystem.size.spacing.xxl,
    height: displayNewSearchHeader
      ? theme.inputs.height.small
      : theme.designSystem.size.spacing.xxl,
    borderRadius: displayNewSearchHeader
      ? theme.designSystem.size.borderRadius.xl
      : theme.designSystem.size.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.designSystem.color.border.default,
  })
)

const StyledFilterIcon = styled(FilterIcon).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const FloatingBadge = styled(Badge)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  backgroundColor: theme.designSystem.color.background.inverted,
}))
