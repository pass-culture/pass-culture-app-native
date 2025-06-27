import { isBefore, subHours } from 'date-fns'

import { BookingVenueResponse, SubcategoryIdEnum } from 'api/gen'
import {
  formatToCompleteFrenchDate,
  formatToHour,
  getTimeZonedDate,
} from 'libs/parsers/formatDates'

type Parameters = {
  subcategoryId: SubcategoryIdEnum
  beginningDatetime: string | undefined
  qrCodeVisibilityHoursBeforeEvent: number
  categoriesToHide?: SubcategoryIdEnum[]
  venue: BookingVenueResponse
  enableHideTicket: boolean
}

export const getHideableQrCodeWithSeat = ({
  beginningDatetime = new Date().toISOString(),
  qrCodeVisibilityHoursBeforeEvent,
  subcategoryId,
  venue,
  categoriesToHide = [],
  enableHideTicket,
}: Parameters) => {
  const now = new Date()
  const isAmongCategoriesToHide = categoriesToHide.includes(subcategoryId)
  const isBeforeHoursOffset = isBefore(
    now,
    subHours(new Date(beginningDatetime || ''), qrCodeVisibilityHoursBeforeEvent)
  )
  const shouldbeHidden = isAmongCategoriesToHide && isBeforeHoursOffset && enableHideTicket

  const timezonedDate = getTimeZonedDate({
    date: subHours(new Date(beginningDatetime), qrCodeVisibilityHoursBeforeEvent),
    timezone: venue?.timezone,
  })
  const day = formatToCompleteFrenchDate(timezonedDate, false)
  const time = formatToHour(timezonedDate)

  return { shouldQrCodeBeHidden: shouldbeHidden, day, time }
}
