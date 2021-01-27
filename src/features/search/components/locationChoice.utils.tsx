import { t } from '@lingui/macro'
import React from 'react'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { buildPlaceLabel } from 'libs/adresse/buildPlaceLabel'
import { LocationType } from 'libs/algolia'
import { _ } from 'libs/i18n'
import { AroundMe } from 'ui/svg/icons/AroundMe'
import { BicolorLocationPointer as Place } from 'ui/svg/icons/BicolorLocationPointer'
import { Everywhere } from 'ui/svg/icons/Everywhere'
import { BicolorIconInterface } from 'ui/svg/icons/types'

export const useLocationChoice = (
  locationType: LocationType
): { Icon: React.FC<BicolorIconInterface>; label: string; isSelected: boolean } => {
  const { searchState } = useSearch()
  const isSelected = locationType === searchState.searchAround

  if (locationType === LocationType.EVERYWHERE)
    return { Icon: Everywhere, label: _(t`Partout`), isSelected }
  if (locationType === LocationType.AROUND_ME)
    return { Icon: AroundMe, label: _(t`Autour de moi`), isSelected }

  const { place } = searchState
  return { Icon: Place, label: place ? buildPlaceLabel(place) : _(t`Choisir un lieu`), isSelected }
}
