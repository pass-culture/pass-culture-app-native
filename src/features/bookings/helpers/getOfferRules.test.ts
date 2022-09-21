import { WithdrawalTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { getOfferRules } from 'features/bookings/helpers'

describe('getOfferRules', () => {
  const booking = bookingsSnap.ongoing_bookings[1]

  it('should return the correct message if hasActivationCode && activationCodeFeatureEnabled', () => {
    const properties = {
      hasActivationCode: true,
      isDigital: false,
      isPhysical: false,
      isEvent: false,
    }
    const activationCodeFeatureEnabled = true
    const offerRules = getOfferRules(properties, undefined, activationCodeFeatureEnabled)
    expect(offerRules).toEqual(
      'Ce code est ta preuve d’achat, il te permet d’accéder à ton offre\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
    )
  })

  it('should return the correct message if isDigital', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: true,
      isPhysical: false,
      isEvent: false,
    }
    const offerRules = getOfferRules(properties)
    expect(offerRules).toEqual(
      'Ce code à 6 caractères est ta preuve d’achat\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
    )
  })

  it('should return the correct message if isPhysical', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: false,
      isPhysical: true,
      isEvent: false,
    }
    const offerRules = getOfferRules(properties)
    expect(offerRules).toEqual(
      'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce code à 6 caractères. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
    )
  })

  it.each([WithdrawalTypeEnum.on_site, null])(
    'should not return message if isEvent and %s withdrawal type',
    (withdrawalType) => {
      const properties = {
        hasActivationCode: false,
        isDigital: false,
        isPhysical: false,
        isEvent: true,
      }
      const newBooking = {
        ...booking,
        externalBookings: [],
        stock: {
          ...booking.stock,
          offer: { ...booking.stock.offer, withdrawalType },
        },
      }
      const offerRules = getOfferRules(properties, newBooking)
      expect(offerRules).toEqual(
        'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce code à 6 caractères. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
      )
    }
  )

  it.each([WithdrawalTypeEnum.no_ticket, WithdrawalTypeEnum.by_email])(
    'should not return message if isEvent and %s withdrawal type',
    (withdrawalType) => {
      const properties = {
        hasActivationCode: false,
        isDigital: false,
        isPhysical: false,
        isEvent: true,
      }
      const newBooking = {
        ...booking,
        externalBookings: [],
        stock: {
          ...booking.stock,
          offer: { ...booking.stock.offer, withdrawalType },
        },
      }
      const offerRules = getOfferRules(properties, newBooking)
      expect(offerRules).toEqual('')
    }
  )

  it('should return the correct message if externalBookingsInfos.length === 1', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: false,
      isPhysical: true,
      isEvent: false,
    }
    booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
    const offerRules = getOfferRules(properties, booking)
    expect(offerRules).toEqual(
      'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce QR code. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
    )
  })

  it('should return the correct message if externalBookingsInfos.length === 2', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: false,
      isPhysical: false,
      isEvent: true,
    }
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
    ]
    const offerRules = getOfferRules(properties, booking)
    expect(offerRules).toEqual(
      'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ces QR codes. N’oublie pas que tu n’as pas le droit de les revendre ou les céder.'
    )
  })

  it('should return an empty string if isEvent, isPhysical, isDigital and hasActivationCode are false', () => {
    const properties = {
      hasActivationCode: false,
      isDigital: false,
      isPhysical: false,
      isEvent: false,
    }
    const offerRules = getOfferRules(properties)
    expect(offerRules).toEqual('')
  })
})
