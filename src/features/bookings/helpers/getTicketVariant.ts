import { ExternalBookingDataResponseV2, TicketDisplayEnum, TicketResponse } from 'api/gen'

type TicketVariantResult =
  | { variant: 'no_ticket' }
  | {
      variant: 'email_withdrawal'
      withdrawalDelay: number | null | undefined
      hasEmailBeenSent: boolean
    }
  | { variant: 'digital_activation'; code: string; completedUrl: string }
  | { variant: 'external_booking'; data: ExternalBookingDataResponseV2[] | undefined }
  | { variant: 'cinema'; voucher: string; token?: string }
  | { variant: 'physical_good'; voucherData: string; tokenData: string }
  | { variant: 'digital_token'; code: string; completedUrl: string }
  | { variant: 'on_site_withdrawal'; token: string }
  | { variant: 'none' }

export const getTicketVariant = (
  ticket: TicketResponse,
  isDigital: boolean,
  isEvent: boolean,
  completedUrl?: string
): TicketVariantResult => {
  if (ticket.display === TicketDisplayEnum.no_ticket) return { variant: 'no_ticket' }

  if (
    ticket.display === TicketDisplayEnum.email_sent ||
    ticket.display === TicketDisplayEnum.email_will_be_sent
  )
    return {
      variant: 'email_withdrawal',
      withdrawalDelay: ticket.withdrawal.delay,
      hasEmailBeenSent: ticket.display === TicketDisplayEnum.email_sent,
    }

  if (ticket.activationCode && completedUrl)
    return { variant: 'digital_activation', code: ticket.activationCode.code, completedUrl }

  if (ticket.externalBooking)
    return { variant: 'external_booking', data: ticket.externalBooking.data ?? undefined }

  if (ticket.voucher?.data && isEvent)
    return {
      variant: 'cinema',
      voucher: ticket.voucher.data,
      token: ticket.token?.data ?? undefined,
    }

  if (ticket.voucher?.data && ticket.token?.data)
    return {
      variant: 'physical_good',
      voucherData: ticket.voucher.data,
      tokenData: ticket.token.data,
    }

  if (ticket.token?.data && isDigital && completedUrl)
    return { variant: 'digital_token', code: ticket.token.data, completedUrl }

  if (ticket.token?.data) return { variant: 'on_site_withdrawal', token: ticket.token.data }

  return { variant: 'none' }
}
