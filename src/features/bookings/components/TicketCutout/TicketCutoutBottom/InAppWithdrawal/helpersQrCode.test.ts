import mockdate from 'mockdate'

import {
  getQrCodeText,
  getQrCodeVisibility,
} from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/helpersQrCode'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'

const qrCodeVisibilityHoursBeforeEvent = 2 * 24

const eventDay = dateBuilder().withDay(16).withMonth(0).withHours(1).toString()
const beforeEventIsVisible = dateBuilder().withDay(13).withHours(1).toString()
const whenEventIsVisible = dateBuilder().withDay(15).withHours(1).toString()

const venue = mockBuilder.bookingVenueResponse()
const lineBreak = '\n'

describe('getQrCodeVisibility', () => {
  it.each`
    mockDate                                    | enableHideTicket | isAmongCategoriesToHide | expected
    ${() => mockdate.set(beforeEventIsVisible)} | ${true}          | ${true}                 | ${true}
    ${() => mockdate.set(beforeEventIsVisible)} | ${false}         | ${false}                | ${false}
    ${() => mockdate.set(beforeEventIsVisible)} | ${true}          | ${false}                | ${false}
    ${() => mockdate.set(beforeEventIsVisible)} | ${false}         | ${true}                 | ${false}
    ${() => mockdate.set(whenEventIsVisible)}   | ${true}          | ${true}                 | ${false}
    ${() => mockdate.set(whenEventIsVisible)}   | ${false}         | ${false}                | ${false}
    ${() => mockdate.set(whenEventIsVisible)}   | ${true}          | ${false}                | ${false}
    ${() => mockdate.set(whenEventIsVisible)}   | ${false}         | ${true}                 | ${false}
  `(
    'should return $expected',
    ({ mockDate, isAmongCategoriesToHide, enableHideTicket, expected }) => {
      mockDate()
      const qrCodeShouldBeHidden = getQrCodeVisibility({
        beginningDatetime: eventDay,
        qrCodeVisibilityHoursBeforeEvent,
        isAmongCategoriesToHide,
        enableHideTicket,
      })

      expect(qrCodeShouldBeHidden).toStrictEqual(expected)
    }
  )
})

describe('getQrCodeText', () => {
  it.each`
    mockDate                                    | shouldQrCodeBeHidden | numberOfExternalBookings | expected
    ${() => mockdate.set(beforeEventIsVisible)} | ${true}              | ${0}                     | ${`Ton billet sera disponible ici${lineBreak}le 14 janvier 2024 à 02h00.`}
    ${() => mockdate.set(beforeEventIsVisible)} | ${true}              | ${1}                     | ${`Ton billet sera disponible ici${lineBreak}le 14 janvier 2024 à 02h00.`}
    ${() => mockdate.set(beforeEventIsVisible)} | ${true}              | ${2}                     | ${`Tes billets seront disponibles ici${lineBreak}le 14 janvier 2024 à 02h00.`}
    ${() => mockdate.set(beforeEventIsVisible)} | ${false}             | ${0}                     | ${'Présente ce billet pour accéder à l’évènement.'}
    ${() => mockdate.set(beforeEventIsVisible)} | ${false}             | ${1}                     | ${'Présente ce billet pour accéder à l’évènement.'}
    ${() => mockdate.set(beforeEventIsVisible)} | ${false}             | ${2}                     | ${'Présente ces billets pour accéder à l’évènement.'}
    ${() => mockdate.set(whenEventIsVisible)}   | ${false}             | ${0}                     | ${'Présente ce billet pour accéder à l’évènement.'}
    ${() => mockdate.set(whenEventIsVisible)}   | ${false}             | ${1}                     | ${'Présente ce billet pour accéder à l’évènement.'}
    ${() => mockdate.set(whenEventIsVisible)}   | ${false}             | ${2}                     | ${'Présente ces billets pour accéder à l’évènement.'}
  `(
    'should return $expected',
    ({ mockDate, shouldQrCodeBeHidden, numberOfExternalBookings, expected }) => {
      mockDate()

      expect(
        getQrCodeText({
          beginningDatetime: eventDay,
          qrCodeVisibilityHoursBeforeEvent,
          venue,
          numberOfExternalBookings,
          shouldQrCodeBeHidden,
        })
      ).toStrictEqual(expected)
    }
  )
})
