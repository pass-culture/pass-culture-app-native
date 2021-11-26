import { t } from '@lingui/macro'
import React from 'react'

import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { AroundMeDeprecated } from 'ui/svg/icons/AroundMe_deprecated'
import { BicolorLocationBuildingDeprecated as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding_deprecated'
import { BicolorLocationPointerDeprecated as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer_deprecated'
import { EverywhereDeprecated } from 'ui/svg/icons/Everywhere_deprecated'
import { BicolorIconInterface } from 'ui/svg/icons/types'

export const useLocationChoice = (
  section: LocationType.PLACE | LocationType.EVERYWHERE | LocationType.AROUND_ME
): { Icon: React.FC<BicolorIconInterface>; label: string; isSelected: boolean } => {
  const { searchState } = useStagedSearch()

  if (section === LocationType.EVERYWHERE)
    return {
      Icon: EverywhereDeprecated,
      label: t`Partout`,
      isSelected: searchState.locationFilter.locationType === LocationType.EVERYWHERE,
    }

  if (section === LocationType.AROUND_ME)
    return {
      Icon: AroundMeDeprecated,
      label: t`Autour de moi`,
      isSelected: searchState.locationFilter.locationType === LocationType.AROUND_ME,
    }

  // the rest is for what's displayed on the section Venue+Place
  if (searchState.locationFilter.locationType === LocationType.VENUE) {
    const label = searchState.locationFilter.venue.label
    return { Icon: LocationBuilding, label, isSelected: true }
  }

  const label =
    searchState.locationFilter.locationType === LocationType.PLACE
      ? searchState.locationFilter.place.label
      : t`Choisir un lieu`

  return {
    Icon: LocationPointer,
    label,
    isSelected: searchState.locationFilter.locationType === LocationType.PLACE,
  }
}
