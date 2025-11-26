import { BookingCancellationReasons } from 'api/gen'

export type EndedBookingReasonKey = 'USED' | 'CANCELLED_BY_OFFERER' | 'ARCHIVED' | 'CANCELLED'

export const getEndedBookingReason = (
  dateUsed: boolean,
  cancellationReason: BookingCancellationReasons | null | undefined,
  isEligibleForArchive?: boolean
): EndedBookingReasonKey => {
  if (dateUsed) return 'USED'
  if (cancellationReason === BookingCancellationReasons.OFFERER) return 'CANCELLED_BY_OFFERER'
  if (isEligibleForArchive && !cancellationReason) return 'ARCHIVED'
  return 'CANCELLED'
}
