import { isBefore, subHours } from 'date-fns'

import { BookingVenueResponse, SubcategoryIdEnum } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatToCompleteFrenchDateTime, getTimeZonedDate } from 'libs/parsers/formatDates'

type Parameters = {
  subcategoryId: SubcategoryIdEnum
  beginningDatetime: string | undefined
  qrCodeVisibilityHoursBeforeEvent: number
  categoriesToHide?: SubcategoryIdEnum[]
  venue: BookingVenueResponse
}

export const useSafeSeatWithQrCode = ({
  beginningDatetime = new Date().toISOString(),
  qrCodeVisibilityHoursBeforeEvent,
  subcategoryId,
  venue,
  categoriesToHide = [],
}: Parameters) => {
  const enableHideTicket = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_HIDE_TICKET)

  const now = new Date()
  const isAmongCategoriesToHide = categoriesToHide.includes(subcategoryId)
  const isBeforeHoursOffset = isBefore(
    now,
    subHours(new Date(beginningDatetime || ''), qrCodeVisibilityHoursBeforeEvent)
  )
  const shouldbeHidden = isAmongCategoriesToHide && isBeforeHoursOffset && enableHideTicket

  const timezonedDate = getTimeZonedDate(
    subHours(new Date(beginningDatetime), qrCodeVisibilityHoursBeforeEvent),
    venue?.timezone
  )
  const day = formatToCompleteFrenchDateTime(timezonedDate, false)

  return { shouldQrCodeBeHidden: shouldbeHidden, day }
}
