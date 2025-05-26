import mockdate from 'mockdate'

import { DomainsCredit, UserProfileResponse } from 'api/gen'
import { nonBeneficiaryUser } from 'fixtures/user'

import { hasOngoingCredit } from './useAvailableCredit'

jest.mock('libs/firebase/analytics/analytics')

describe('useAvailableCredit', () => {
  mockdate.set(new Date('2020-12-01T00:00:00.000Z'))

  const noMoreCredit = {
    all: { initial: 0, remaining: 0 },
    physical: { initial: 0, remaining: 0 },
    digital: { initial: 0, remaining: 0 },
  }
  const remainingCredit = {
    all: { initial: 150, remaining: 20 },
    physical: { initial: 0, remaining: 0 },
    digital: { initial: 0, remaining: 0 },
  }

  describe('hasOngoingCredit', () => {
    it.each`
      depositExpirationDate         | domainsCreditAllRemaining | expected
      ${'2022-12-01T00:00:00.000Z'} | ${remainingCredit}        | ${true}
      ${'2019-12-01T00:00:00.000Z'} | ${remainingCredit}        | ${false}
      ${undefined}                  | ${remainingCredit}        | ${false}
      ${'2020-12-01T00:00:00.000Z'} | ${remainingCredit}        | ${true}
      ${'2022-12-01T00:00:00.000Z'} | ${noMoreCredit}           | ${false}
      ${'2019-12-01T00:00:00.000Z'} | ${noMoreCredit}           | ${false}
      ${undefined}                  | ${noMoreCredit}           | ${false}
      ${'2020-12-01T00:00:00.000Z'} | ${noMoreCredit}           | ${false}
    `(
      'should return $expected when depositExpirationDate equals $depositExpirationDate, and domainsCredit?.all.remaining equals $domainsCreditAllRemaining',
      ({
        depositExpirationDate,
        domainsCreditAllRemaining,
        expected,
      }: {
        depositExpirationDate: string
        domainsCreditAllRemaining: DomainsCredit
        expected: boolean
      }) => {
        const mockedUser: UserProfileResponse = {
          ...nonBeneficiaryUser,
          depositExpirationDate: depositExpirationDate,
          domainsCredit: domainsCreditAllRemaining,
        }
        const result = hasOngoingCredit(mockedUser)

        expect(result).toEqual(expected)
      }
    )
  })
})
