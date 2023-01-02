import { Again } from 'ui/svg/icons/Again'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Error } from 'ui/svg/icons/Error'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Info } from 'ui/svg/icons/Info'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

export const matchSubscriptionMessageIconToSvg = (
  iconName: string | undefined | null,
  useFallbackIcon?: boolean | undefined
) => {
  switch (iconName) {
    case undefined:
    case null:
      return undefined
    case 'CLOCK':
      return BicolorClock
    case 'EXTERNAL':
      return ExternalSiteFilled
    case 'MAGNIFYING_GLASS':
      return MagnifyingGlass
    case 'ERROR':
      return Error
    case 'WARNING':
      return Warning
    case 'EMAIL':
      return EmailFilled
    case 'FILE':
      return LegalNotices
    case 'RETRY':
      return Again
    default:
      return useFallbackIcon ? Info : undefined
  }
}
