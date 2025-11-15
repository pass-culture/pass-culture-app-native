import { BookingCancellationReasons } from 'api/gen'

import { getEndedBookingReason } from './getEndedBookingReason'

describe('getEndedBookingReason', () => {
  it.each`
    dateUsed | cancellationReason                        | isEligibleForArchive | expected
    ${true}  | ${null}                                   | ${false}             | ${'USED'}
    ${true}  | ${BookingCancellationReasons.OFFERER}     | ${false}             | ${'USED'}
    ${false} | ${BookingCancellationReasons.OFFERER}     | ${false}             | ${'CANCELLED_BY_OFFERER'}
    ${false} | ${null}                                   | ${true}              | ${'ARCHIVED'}
    ${false} | ${undefined}                              | ${true}              | ${'ARCHIVED'}
    ${false} | ${null}                                   | ${false}             | ${'CANCELLED'}
    ${false} | ${null}                                   | ${undefined}         | ${'CANCELLED'}
    ${false} | ${BookingCancellationReasons.BENEFICIARY} | ${false}             | ${'CANCELLED'}
  `(
    'should return $expected when dateUsed=$dateUsed, cancellationReason=$cancellationReason, isEligibleForArchive=$isEligibleForArchive',
    ({ dateUsed, cancellationReason, isEligibleForArchive, expected }) => {
      const result = getEndedBookingReason(dateUsed, cancellationReason, isEligibleForArchive)

      expect(result).toBe(expected)
    }
  )
})
