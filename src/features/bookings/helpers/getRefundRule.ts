import { isCurrentlyBeneficiary } from 'features/auth/helpers/checkStatusType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { UserProfile } from 'features/share/types'
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
  user?: UserProfile
}) => {
  const price = convertCentsToEuros(totalAmount)
  if (price > 0 && user) {
    const price = formatCurrencyFromCents(totalAmount, currency, euroToPacificFrancRate)
    if (user.statusType === UserStatusType.EX_BENEFICIARY) {
      return `Les ${price} ne seront pas recrédités sur ton pass Culture car il est expiré.`
    }

    if (isCurrentlyBeneficiary(user)) {
      return `${price} seront recrédités sur ton pass Culture.`
    }
  }
  return null
}
