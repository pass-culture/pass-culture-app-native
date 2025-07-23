import { subHours } from 'date-fns'

import {
  formatToCompleteFrenchDate,
  formatToHour,
  getTimeZonedDate,
} from 'libs/parsers/formatDates'

export const getHiddenQRCodeTextInfos = (
  beginningDatetime = new Date().toISOString(),
  qrCodeVisibilityHoursBeforeEvent = 48,
  timezone = 'Europe/Paris'
) => {
  const timezonedDate = getTimeZonedDate({
    date: subHours(new Date(beginningDatetime), qrCodeVisibilityHoursBeforeEvent),
    timezone,
  })
  const day = formatToCompleteFrenchDate({ date: timezonedDate, shouldDisplayWeekDay: false })
  const time = formatToHour(timezonedDate)

  return { day, time }
}
