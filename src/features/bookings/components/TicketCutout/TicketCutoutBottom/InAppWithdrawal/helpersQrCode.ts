import { isBefore, subHours } from 'date-fns'

import { BookingVenueResponse } from 'api/gen'
import {
  formatToCompleteFrenchDate,
  formatToHour,
  getTimeZonedDate,
} from 'libs/parsers/formatDates'
import { LINE_BREAK } from 'ui/theme/constants'

type ParametersGetQrCodeVisibility = {
  beginningDatetime: string | undefined
  qrCodeVisibilityHoursBeforeEvent: number
  isAmongCategoriesToHide: boolean
  enableHideTicket: boolean
}

export const getQrCodeVisibility = ({
  beginningDatetime = new Date().toISOString(),
  qrCodeVisibilityHoursBeforeEvent,
  isAmongCategoriesToHide,
  enableHideTicket,
}: ParametersGetQrCodeVisibility) => {
  const now = new Date()

  const isBeforeHoursOffset = isBefore(
    now,
    subHours(new Date(beginningDatetime || ''), qrCodeVisibilityHoursBeforeEvent)
  )

  return isAmongCategoriesToHide && isBeforeHoursOffset && enableHideTicket
}

type ParametersGetQrCodeText = {
  beginningDatetime: string | undefined
  qrCodeVisibilityHoursBeforeEvent: number
  venue: BookingVenueResponse
  shouldQrCodeBeHidden: boolean
  numberOfExternalBookings?: number
}

export const getQrCodeText = ({
  beginningDatetime = new Date().toISOString(),
  qrCodeVisibilityHoursBeforeEvent,
  venue,
  numberOfExternalBookings,
  shouldQrCodeBeHidden,
}: ParametersGetQrCodeText) => {
  const timezonedDate = getTimeZonedDate(
    subHours(new Date(beginningDatetime), qrCodeVisibilityHoursBeforeEvent),
    venue?.timezone
  )
  const day = formatToCompleteFrenchDate(timezonedDate, false)
  const time = formatToHour(timezonedDate)

  const multipleTickets = numberOfExternalBookings && numberOfExternalBookings > 1

  const hiddenQrCodeText = `${multipleTickets ? 'Tes billets seront disponibles' : 'Ton billet sera disponible'} ici${LINE_BREAK}le ${day} à ${time}.`
  const visibleQrCodeText = `Présente ${multipleTickets ? 'ces billets' : 'ce billet'} pour accéder à l’évènement.`

  const qrCodeText = shouldQrCodeBeHidden ? hiddenQrCodeText : visibleQrCodeText
  return qrCodeText
}
