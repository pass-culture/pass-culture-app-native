import { UserProfileResponse } from 'api/gen'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

export const getRefundRule = ({
  totalAmount,
  currency,
  euroToPacificFrancRate,
  user,
}: {
  totalAmount: number
  currency: Currency
  euroToPacificFrancRate: number
  user?: UserProfileResponse
}) => {
  const price = convertCentsToEuros(totalAmount)
  if (price > 0 && user) {
    const isExBeneficiary = !user.isBeneficiary
    const price = formatCurrencyFromCents(totalAmount, currency, euroToPacificFrancRate)
    if (isExBeneficiary) {
      return `Les ${price} ne seront pas recrédités sur ton pass Culture car il est expiré.`
    }

    if (user.isBeneficiary) {
      return `${price} seront recrédités sur ton pass Culture.`
    }
  }
  return null
}
