import { t } from '@lingui/macro'
import React from 'react'

import { LocationType } from 'libs/algolia'
import { _ } from 'libs/i18n'
import { AroundMe } from 'ui/svg/icons/AroundMe'
import { BicolorLocationPointer as Place } from 'ui/svg/icons/BicolorLocationPointer'
import { Everywhere } from 'ui/svg/icons/Everywhere'
import { BicolorIconInterface } from 'ui/svg/icons/types'

export const getLocationChoiceName = (locationChoice: LocationType): string => {
  switch (locationChoice) {
    case LocationType.AROUND_ME:
      return _(t`Autour de moi`)
    case LocationType.EVERYWHERE:
      return _(t`Partout`)
    case LocationType.PLACE:
      return _(t`Choisir un lieu`)
    default:
      return _(t`Partout`)
  }
}

export const getLocationChoiceIcon = (
  locationChoice: LocationType
): React.FC<BicolorIconInterface> => {
  switch (locationChoice) {
    case LocationType.AROUND_ME:
      return AroundMe
    case LocationType.EVERYWHERE:
      return Everywhere
    case LocationType.PLACE:
      return Place
    default:
      return AroundMe
  }
}
