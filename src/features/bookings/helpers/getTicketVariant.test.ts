import { TicketDisplayEnum, TicketResponse } from 'api/gen'
import { getTicketVariant } from 'features/bookings/helpers/getTicketVariant'

const BASE_TICKET: TicketResponse = {
  display: TicketDisplayEnum.qr_code,
  withdrawal: { delay: null },
}

describe('getTicketVariant', () => {
  describe('no_ticket', () => {
    it('should return no_ticket when display is no_ticket', () => {
      const ticket: TicketResponse = { ...BASE_TICKET, display: TicketDisplayEnum.no_ticket }

      const result = getTicketVariant(ticket, false, false)

      expect(result).toEqual({ variant: 'no_ticket' })
    })
  })

  describe('email_withdrawal', () => {
    it('should return email_withdrawal with hasEmailBeenSent true when display is email_sent', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        display: TicketDisplayEnum.email_sent,
        withdrawal: { delay: 3600 },
      }

      const result = getTicketVariant(ticket, false, false)

      expect(result).toEqual({
        variant: 'email_withdrawal',
        withdrawalDelay: 3600,
        hasEmailBeenSent: true,
      })
    })

    it('should return email_withdrawal with hasEmailBeenSent false when display is email_will_be_sent', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        display: TicketDisplayEnum.email_will_be_sent,
        withdrawal: { delay: null },
      }

      const result = getTicketVariant(ticket, false, false)

      expect(result).toEqual({
        variant: 'email_withdrawal',
        withdrawalDelay: null,
        hasEmailBeenSent: false,
      })
    })
  })

  describe('digital_activation', () => {
    it('should return digital_activation when activationCode and completedUrl are present', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        activationCode: { code: 'ABC123' },
      }

      const result = getTicketVariant(ticket, false, false, 'https://example.com')

      expect(result).toEqual({
        variant: 'digital_activation',
        code: 'ABC123',
        completedUrl: 'https://example.com',
      })
    })

    it('should not return digital_activation when completedUrl is missing', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        activationCode: { code: 'ABC123' },
      }

      const result = getTicketVariant(ticket, false, false)

      expect(result.variant).not.toBe('digital_activation')
    })
  })

  describe('external_booking', () => {
    it('should return external_booking when externalBooking is present', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        externalBooking: { data: [{ barcode: '123', seat: 'A1' }] },
      }

      const result = getTicketVariant(ticket, false, false)

      expect(result).toEqual({
        variant: 'external_booking',
        data: [{ barcode: '123', seat: 'A1' }],
      })
    })

    it('should return external_booking with undefined data when externalBooking.data is null', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        externalBooking: { data: null },
      }

      const result = getTicketVariant(ticket, false, false)

      expect(result).toEqual({ variant: 'external_booking', data: undefined })
    })
  })

  describe('cinema', () => {
    it('should return cinema when voucher data is present and isEvent is true', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        voucher: { data: 'VOUCHER_QR' },
        token: { data: 'TOKEN_123' },
      }

      const result = getTicketVariant(ticket, false, true)

      expect(result).toEqual({
        variant: 'cinema',
        voucher: 'VOUCHER_QR',
        token: 'TOKEN_123',
      })
    })

    it('should return cinema with undefined token when token is missing', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        voucher: { data: 'VOUCHER_QR' },
      }

      const result = getTicketVariant(ticket, false, true)

      expect(result).toEqual({
        variant: 'cinema',
        voucher: 'VOUCHER_QR',
        token: undefined,
      })
    })
  })

  describe('physical_good', () => {
    it('should return physical_good when voucher and token data are present and isEvent is false', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        voucher: { data: 'VOUCHER_QR' },
        token: { data: 'TOKEN_123' },
      }

      const result = getTicketVariant(ticket, false, false)

      expect(result).toEqual({
        variant: 'physical_good',
        voucherData: 'VOUCHER_QR',
        tokenData: 'TOKEN_123',
      })
    })

    it('should not return physical_good when voucher exists but token is missing', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        voucher: { data: 'VOUCHER_QR' },
      }

      const result = getTicketVariant(ticket, false, false)

      expect(result.variant).not.toBe('physical_good')
    })
  })

  describe('digital_token', () => {
    it('should return digital_token when token, isDigital, and completedUrl are present', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        token: { data: 'TOKEN_123' },
      }

      const result = getTicketVariant(ticket, true, false, 'https://example.com')

      expect(result).toEqual({
        variant: 'digital_token',
        code: 'TOKEN_123',
        completedUrl: 'https://example.com',
      })
    })

    it('should not return digital_token when isDigital is false', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        token: { data: 'TOKEN_123' },
      }

      const result = getTicketVariant(ticket, false, false, 'https://example.com')

      expect(result.variant).not.toBe('digital_token')
    })
  })

  describe('on_site_withdrawal', () => {
    it('should return on_site_withdrawal when only token data is present', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        token: { data: 'TOKEN_123' },
      }

      const result = getTicketVariant(ticket, false, false)

      expect(result).toEqual({ variant: 'on_site_withdrawal', token: 'TOKEN_123' })
    })
  })

  describe('none', () => {
    it('should return none when no conditions match', () => {
      const result = getTicketVariant(BASE_TICKET, false, false)

      expect(result).toEqual({ variant: 'none' })
    })

    it('should return none when voucher exists without token and isEvent is false', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        voucher: { data: 'VOUCHER_QR' },
      }

      const result = getTicketVariant(ticket, false, false)

      expect(result).toEqual({ variant: 'none' })
    })
  })

  describe('priority ordering', () => {
    it('should prioritize digital_activation over external_booking', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        activationCode: { code: 'ABC123' },
        externalBooking: { data: [{ barcode: '123', seat: 'A1' }] },
      }

      const result = getTicketVariant(ticket, false, false, 'https://example.com')

      expect(result.variant).toBe('digital_activation')
    })

    it('should prioritize cinema over physical_good when isEvent is true', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        voucher: { data: 'VOUCHER_QR' },
        token: { data: 'TOKEN_123' },
      }

      const result = getTicketVariant(ticket, false, true)

      expect(result.variant).toBe('cinema')
    })

    it('should prioritize email_withdrawal over all ticket-data variants', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        display: TicketDisplayEnum.email_sent,
        activationCode: { code: 'ABC123' },
        token: { data: 'TOKEN_123' },
        voucher: { data: 'VOUCHER_QR' },
      }

      const result = getTicketVariant(ticket, true, true, 'https://example.com')

      expect(result.variant).toBe('email_withdrawal')
    })

    it('should prioritize digital_token over on_site_withdrawal when isDigital and completedUrl', () => {
      const ticket: TicketResponse = {
        ...BASE_TICKET,
        token: { data: 'TOKEN_123' },
      }

      const result = getTicketVariant(ticket, true, false, 'https://example.com')

      expect(result.variant).toBe('digital_token')
    })
  })
})
