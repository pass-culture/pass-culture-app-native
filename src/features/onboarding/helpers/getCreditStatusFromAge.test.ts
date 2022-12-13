import { getCreditStatusFromAge } from 'features/onboarding/helpers/getCreditStatusFromAge'
import { CreditStatus } from 'features/onboarding/types'

const AGES = [15, 16, 17, 18]

describe('getCreditStatusFromAge', () => {
  it.each`
    userAge      | expectedStatus
    ${15}        | ${[CreditStatus.ONGOING, CreditStatus.COMING, CreditStatus.COMING, CreditStatus.COMING]}
    ${16}        | ${[CreditStatus.GONE, CreditStatus.ONGOING, CreditStatus.COMING, CreditStatus.COMING]}
    ${17}        | ${[CreditStatus.GONE, CreditStatus.GONE, CreditStatus.ONGOING, CreditStatus.COMING]}
    ${18}        | ${[CreditStatus.GONE, CreditStatus.GONE, CreditStatus.GONE, CreditStatus.ONGOING]}
    ${undefined} | ${[undefined, undefined, undefined, undefined]}
  `(
    'should return statuses $expectedStatus for $userAge-year-old',
    ({ userAge, expectedStatus }) => {
      const statuses = AGES.map((age) => getCreditStatusFromAge(userAge, age))
      expect(statuses).toEqual(expectedStatus)
    }
  )
})
