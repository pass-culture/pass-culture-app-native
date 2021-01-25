import { t } from '@lingui/macro'
import React from 'react'

import { LocationType } from 'libs/algolia'
import { _ } from 'libs/i18n'
import { AroundMe } from 'ui/svg/icons/AroundMe'
import { Everywhere } from 'ui/svg/icons/Everywhere'
import { BicolorIconInterface } from 'ui/svg/icons/types'

export const getLocationChoiceName = (locationChoice: LocationType): string => {
  switch (locationChoice) {
    case LocationType.AROUND_ME:
      return _(t`Autour de moi`)
    case LocationType.EVERYWHERE:
      return _(t`Partout`)
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
    default:
      return AroundMe
  }
}
