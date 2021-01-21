import { t } from '@lingui/macro'
import React from 'react'

import { LocationChoiceType } from 'features/search/locationChoice.types'
import { _ } from 'libs/i18n'
import { AroundMe } from 'ui/svg/icons/AroundMe'
import { Everywhere } from 'ui/svg/icons/Everywhere'
import { BicolorIconInterface } from 'ui/svg/icons/types'

export const getLocationChoiceName = (locationChoice: LocationChoiceType): string => {
  switch (locationChoice) {
    case LocationChoiceType.LOCALIZED:
      return _(t`Autour de moi`)
    case LocationChoiceType.EVERYWHERE:
      return _(t`Partout`)
    default:
      return _(t`Partout`)
  }
}

export const getLocationChoiceIcon = (
  locationChoice: LocationChoiceType
): React.FC<BicolorIconInterface> => {
  switch (locationChoice) {
    case LocationChoiceType.LOCALIZED:
      return AroundMe
    case LocationChoiceType.EVERYWHERE:
      return Everywhere
    default:
      return AroundMe
  }
}
