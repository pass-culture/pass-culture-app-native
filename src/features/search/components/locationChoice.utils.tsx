import { t } from '@lingui/macro'
import React from 'react'

import { LocationType } from 'features/search/enums'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { BicolorAroundMe as AroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { BicolorLocationBuilding as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { BicolorIconInterface } from 'ui/svg/icons/types'

export const useLocationChoice = (
  section: LocationType.PLACE | LocationType.EVERYWHERE | LocationType.AROUND_ME
): { Icon: React.FC<BicolorIconInterface>; label: string; isSelected: boolean } => {
  const { searchState } = useSearch()

  if (section === LocationType.EVERYWHERE)
    return {
      Icon: Everywhere,
      label: t`Partout`,
      isSelected: searchState.locationFilter.locationType === LocationType.EVERYWHERE,
    }

  if (section === LocationType.AROUND_ME)
    return {
      Icon: AroundMe,
      label: t`Autour de moi`,
      isSelected: searchState.locationFilter.locationType === LocationType.AROUND_ME,
    }

  // the rest is for what's displayed on the section Venue+Place
  if (searchState.locationFilter.locationType === LocationType.VENUE) {
    const venueLabel = searchState.locationFilter.venue.label
    return { Icon: LocationBuilding, label: venueLabel, isSelected: true }
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
