import { isBefore, subHours } from 'date-fns'

import { BookingVenueResponse, SubcategoryIdEnum } from 'api/gen'
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
  const now = new Date()
  const isAmongCategoriesToHide = categoriesToHide.includes(subcategoryId)
  const isBeforeHoursOffset = isBefore(
    now,
    subHours(new Date(beginningDatetime || ''), qrCodeVisibilityHoursBeforeEvent)
  )
  const shouldbeHidden = isAmongCategoriesToHide && isBeforeHoursOffset

  const timezonedDate = getTimeZonedDate(
    subHours(new Date(beginningDatetime), qrCodeVisibilityHoursBeforeEvent),
    venue?.timezone
  )
  const day = formatToCompleteFrenchDateTime(timezonedDate, false)

  return { shouldQrCodeBeHidden: shouldbeHidden, day }
}
