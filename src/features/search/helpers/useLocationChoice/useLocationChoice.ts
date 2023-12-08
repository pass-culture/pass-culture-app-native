import React from 'react'

import { useSearch } from 'features/search/context/SearchWrapper'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { BicolorAroundMe as AroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { BicolorLocationBuilding as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { BicolorIconInterface } from 'ui/svg/icons/types'

export const useLocationChoice = (
  section: LocationMode.AROUND_PLACE | LocationMode.EVERYWHERE | LocationMode.AROUND_ME
): { Icon: React.FC<BicolorIconInterface>; label: string; isSelected: boolean } => {
  const { searchState } = useSearch()
  const { geolocPosition } = useLocation()

  if (section === LocationMode.EVERYWHERE)
    return {
      Icon: Everywhere,
      label: geolocPosition === null ? '' : 'Partout',
      isSelected: searchState.locationFilter.locationType === LocationMode.EVERYWHERE,
    }

  if (section === LocationMode.AROUND_ME)
    return {
      Icon: AroundMe,
      label: 'Autour de moi',
      isSelected: searchState.locationFilter.locationType === LocationMode.AROUND_ME,
    }

  // the rest is for what's displayed on the section Venue+Place
  if (searchState.venue) {
    const venueLabel = searchState.venue.label
    return { Icon: LocationBuilding, label: venueLabel, isSelected: true }
  }

  const label =
    searchState.locationFilter.locationType === LocationMode.AROUND_PLACE
      ? searchState.locationFilter.place.label
      : 'Choisir un lieu'

  return {
    Icon: LocationPointer,
    label,
    isSelected: searchState.locationFilter.locationType === LocationMode.AROUND_PLACE,
  }
}
