import { getRefundRule } from 'features/bookings/helpers/getRefundRule'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

describe('getRefundRules', () => {
  it.each`
    totalAmount | currency                        | euroToPacificFrancRate | user                  | expected
    ${1000}     | ${Currency.EURO}                | ${10}                  | ${nonBeneficiaryUser} | ${'Les 10\u00a0€ ne seront pas recrédités sur ton pass Culture car il est expiré.'}
    ${100000}   | ${Currency.PACIFIC_FRANC_SHORT} | ${10}                  | ${nonBeneficiaryUser} | ${'Les 100\u00a0F ne seront pas recrédités sur ton pass Culture car il est expiré.'}
    ${1000}     | ${Currency.EURO}                | ${10}                  | ${beneficiaryUser}    | ${`10\u00a0€ seront recrédités sur ton pass Culture.`}
    ${0}        | ${Currency.EURO}                | ${10}                  | ${beneficiaryUser}    | ${null}
    ${1000}     | ${Currency.EURO}                | ${10}                  | ${undefined}          | ${null}
  `(
    'should return the refund message or null',
    ({ totalAmount, currency, euroToPacificFrancRate, user, expected }) => {
      expect(
        getRefundRule({
          totalAmount,
          currency,
          euroToPacificFrancRate,
          user,
        })
      ).toEqual(expected)
    }
  )
})
