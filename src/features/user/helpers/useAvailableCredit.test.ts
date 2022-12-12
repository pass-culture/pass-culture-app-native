import mockdate from 'mockdate'

import { UserProfileResponse } from 'api/gen'
import { hasOngoingCredit } from 'features/user/helpers/useAvailableCredit'
import { nonBeneficiaryUser } from 'fixtures/user'

describe('useAvailableCredit', () => {
  mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

  describe('hasOngoingCredit', () => {
    it.each`
      depositExpirationDate         | expected
      ${'2022-12-01T00:00:00.000Z'} | ${true}
      ${'2019-12-01T00:00:00.000Z'} | ${false}
      ${undefined}                  | ${false}
      ${'2020-12-01T00:00:00.000Z'} | ${true}
    `(
      'should return $expected when depositExpirationDate equals $depositExpirationDate',
      ({
        depositExpirationDate,
        expected,
      }: {
        depositExpirationDate: string
        expected: boolean
      }) => {
        const mockedUser: UserProfileResponse = {
          ...nonBeneficiaryUser,
          depositExpirationDate: depositExpirationDate,
        }
        const result = hasOngoingCredit(mockedUser)

        expect(result).toEqual(expected)
      }
    )
  })
})
