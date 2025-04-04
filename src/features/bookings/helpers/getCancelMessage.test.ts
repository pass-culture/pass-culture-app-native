import mockdate from 'mockdate'

import { getCancelMessage } from 'features/bookings/helpers/getCancelMessage'
import { beneficiaryUser } from 'fixtures/user'
import { LINE_BREAK } from 'ui/theme/constants'

const today = '2021-02-01T00:00:00.000Z'
mockdate.set(today)
const exBeneficiaryUser = {
  ...beneficiaryUser,
  domainsCredit: {
    all: { initial: 300_00, remaining: 0 },
    physical: { initial: 300_00, remaining: 0 },
    digital: { initial: 300_00, remaining: 0 },
  },
}

describe('getCancelMessage', () => {
  it.each`
    confirmationDate | expirationDate  | isDigitalBooking | isFreeOfferToArchive | user                 | expected
    ${undefined}     | ${'01/03/2021'} | ${false}         | ${true}              | ${undefined}         | ${'Ta réservation sera archivée le 01/03/2021'}
    ${undefined}     | ${'01/03/2021'} | ${true}          | ${false}             | ${undefined}         | ${'Ta réservation sera archivée le 01/03/2021'}
    ${undefined}     | ${'01/03/2021'} | ${false}         | ${false}             | ${undefined}         | ${''}
    ${'01/01/2021'}  | ${'01/01/2021'} | ${false}         | ${false}             | ${undefined}         | ${`Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le 1er janvier 2021`}
    ${'10/03/2021'}  | ${'01/03/2021'} | ${false}         | ${false}             | ${undefined}         | ${`La réservation est annulable jusqu’au\u00a03 octobre 2021`}
    ${'01/01/2021'}  | ${'01/03/2021'} | ${false}         | ${false}             | ${exBeneficiaryUser} | ${`Ton crédit est expiré.${LINE_BREAK}Tu ne peux plus annuler ta réservation\u00a0: elle devait être annulée avant le 1er janvier 2021`}
    ${'01/01/2021'}  | ${'01/03/2021'} | ${true}          | ${false}             | ${undefined}         | ${`Tu ne peux plus annuler ta réservation. Elle expirera automatiquement le 01/03/2021`}
  `(
    'getCancelMessage({ confirmationDate: $confirmationDate, expirationDate: $expirationDate , isDigitalBooking : $isDigitalBooking, isFreeOfferToArchive : $isFreeOfferToArchive , user:$user}) \t= $expected',
    ({
      confirmationDate,
      expirationDate,
      isDigitalBooking,
      isFreeOfferToArchive,
      user,
      expected,
    }) => {
      expect(
        getCancelMessage({
          confirmationDate,
          expirationDate,
          isDigitalBooking,
          isFreeOfferToArchive,
          user,
        })
      ).toBe(expected)
    }
  )
})
