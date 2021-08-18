import React from 'react'
import waitForExpect from 'wait-for-expect'

import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { Booking } from 'features/bookings/components/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { superFlushWithAct, render } from 'tests/utils'

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { firstName: 'Christophe', lastName: 'Dupont' } })),
}))

describe('<BookingPropertiesSection />', () => {
  const booking = bookingsSnap.ongoing_bookings[0]

  it('should display user firstname and lastname', async () => {
    const { findByText } = await renderBookingProperties(booking)

    await waitForExpect(() => {
      expect(findByText('Christophe\u00a0Dupont')).toBeTruthy()
    })
  })

  it('should display duo icon when offer is duo', async () => {
    booking.quantity = 2
    const { getByTestId } = await renderBookingProperties(booking)

    await waitForExpect(() => {
      expect(getByTestId('duo-icon')).toBeTruthy()
    })
  })

  it('should display date label', async () => {
    const { findByText } = await renderBookingProperties(booking)

    await waitForExpect(() => {
      expect(findByText('Le 15 mars 2021 à 20h00')).toBeTruthy()
    })
  })

  it('should display location label if offer is not permanent and not a digital event', async () => {
    booking.stock.offer.isDigital = false
    booking.stock.offer.isPermanent = false
    const { findByText } = await renderBookingProperties(booking)
    await waitForExpect(() => {
      expect(findByText('Maison de la Brique, Drancy')).toBeTruthy()
    })
  })
})

async function renderBookingProperties(booking: Booking) {
  const wrapper = render(
    reactQueryProviderHOC(
      <BookingPropertiesSection
        booking={booking}
        appSettings={{
          allowIdCheckRegistration: false,
          autoActivateDigitalBookings: false,
          depositAmount: 30000,
          enableNativeIdCheckVersion: false,
          enableNativeIdCheckVerboseDebugging: false,
          enableIdCheckRetention: false,
          enablePhoneValidation: false,
          isRecaptchaEnabled: false,
          wholeFranceOpening: true,
          objectStorageUrl: 'http://localhost',
          displayDmsRedirection: true,
          idCheckAddressAutocompletion: false,
          useAppSearch: true,
          isWebappV2Enabled: false,
        }}
      />
    )
  )
  await superFlushWithAct()
  return wrapper
}
