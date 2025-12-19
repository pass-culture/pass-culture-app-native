import { BookingReponse } from 'api/gen'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'
import { LINE_BREAK } from 'ui/theme/constants'

type Arguments = {
  confirmationDate: BookingReponse['confirmationDate']
  expirationDate: string
  isDigitalBookingWithoutExpirationDate: boolean
  isFreeOfferToArchive: boolean
  user?: UserProfileResponseWithoutSurvey
  displayAsEnded?: boolean
}

export const getCancelMessage = ({
  confirmationDate,
  expirationDate,
  isDigitalBookingWithoutExpirationDate,
  isFreeOfferToArchive,
  user,
  displayAsEnded,
}: Arguments): string => {
  const archiveMessage = `Ta réservation sera archivée le ${expirationDate}`
  const isExBeneficiary = user && isUserExBeneficiary(user)

  if (isFreeOfferToArchive) return archiveMessage
  if (displayAsEnded)
    return 'Ta réservation a été archivée mais tu peux toujours y accéder dans la section “Réservations terminées”'
  if (!confirmationDate) return isDigitalBookingWithoutExpirationDate ? archiveMessage : ''
  const formattedConfirmationDate = formatToCompleteFrenchDate({
    date: new Date(confirmationDate),
    shouldDisplayWeekDay: false,
  })
  const defaultBookingStatusMessage = `Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le ${formattedConfirmationDate}`
  const message = {
    stillCancellable: `La réservation est annulable jusqu’au\u00a0${formattedConfirmationDate}`,
    isExBeneficiary: `Ton crédit est expiré.${LINE_BREAK}${defaultBookingStatusMessage}`,
    expirationDate: `Tu ne peux plus annuler ta réservation. Elle expirera automatiquement le ${expirationDate}`,
  }

  if (new Date(confirmationDate) > new Date()) {
    return message.stillCancellable
  } else if (isExBeneficiary) {
    return message.isExBeneficiary
  } else if (isDigitalBookingWithoutExpirationDate) {
    return message.expirationDate
  } else {
    return defaultBookingStatusMessage
  }
}
