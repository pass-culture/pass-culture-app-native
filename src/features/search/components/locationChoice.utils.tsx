import { t } from '@lingui/macro'
import React from 'react'

import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { AroundMe } from 'ui/svg/icons/AroundMe'
import { BicolorLocationPointer as LocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { Everywhere } from 'ui/svg/icons/Everywhere'
import { BicolorIconInterface } from 'ui/svg/icons/types'

export const useLocationChoice = (
  locationType: LocationType
): { Icon: React.FC<BicolorIconInterface>; label: string; isSelected: boolean } => {
  const { searchState } = useStagedSearch()
  const isSelected = locationType === searchState.locationType

  if (locationType === LocationType.EVERYWHERE)
    return { Icon: Everywhere, label: t`Partout`, isSelected }
  if (locationType === LocationType.AROUND_ME)
    return { Icon: AroundMe, label: t`Autour de moi`, isSelected }

  const { place } = searchState
  return { Icon: LocationPointer, label: place ? place.label : t`Choisir un lieu`, isSelected }
}
