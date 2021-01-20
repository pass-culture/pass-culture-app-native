import { t } from '@lingui/macro'
import React from 'react'

import { LocationChoiceType } from 'features/search/locationChoice.types'
import { _ } from 'libs/i18n'
import { AroundMe } from 'ui/svg/icons/AroundMe'
import { Everywhere } from 'ui/svg/icons/Everywhere'
import { ColorsEnum } from 'ui/theme'

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
  locationChoice: LocationChoiceType,
  selected: boolean
): JSX.Element => {
  switch (locationChoice) {
    case LocationChoiceType.LOCALIZED:
      return <AroundMe size={48} color2={selected ? ColorsEnum.PRIMARY : ColorsEnum.SECONDARY} />
    case LocationChoiceType.EVERYWHERE:
      return <Everywhere size={48} color2={selected ? ColorsEnum.PRIMARY : ColorsEnum.SECONDARY} />
    default:
      return <AroundMe size={48} color2={selected ? ColorsEnum.PRIMARY : ColorsEnum.SECONDARY} />
  }
}
