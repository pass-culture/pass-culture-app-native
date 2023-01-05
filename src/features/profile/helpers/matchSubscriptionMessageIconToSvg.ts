import { FunctionComponent } from 'react'

import { CallToActionIcon, PopOverIcon } from 'api/gen'
import { Again } from 'ui/svg/icons/Again'
import { Clock } from 'ui/svg/icons/BicolorClock'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Error } from 'ui/svg/icons/Error'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Info } from 'ui/svg/icons/Info'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { IconInterface } from 'ui/svg/icons/types'

export const matchSubscriptionMessageIconToSvg = (
  iconName: PopOverIcon | CallToActionIcon | undefined | null,
  fallbackIcon?: FunctionComponent<IconInterface>
) => {
  switch (iconName) {
    case PopOverIcon.CLOCK:
      return Clock
    case PopOverIcon.MAGNIFYING_GLASS:
      return MagnifyingGlass
    case PopOverIcon.ERROR:
      return Error
    case PopOverIcon.WARNING:
      return Warning
    case PopOverIcon.FILE:
      return LegalNotices
    case PopOverIcon.INFO:
      return Info

    case CallToActionIcon.EMAIL:
      return EmailFilled
    case CallToActionIcon.EXTERNAL:
      return ExternalSiteFilled
    case CallToActionIcon.RETRY:
      return Again

    case null:
    case undefined:
      return fallbackIcon
  }
}
