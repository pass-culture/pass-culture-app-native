import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { getAge } from 'shared/user/getAge'

type Props = { user: UserProfileResponseWithoutSurvey | undefined }

export const getShouldDisplayHelpButton = ({ user }: Props): boolean => {
  if (user) {
    const { birthDate, domainsCredit, depositExpirationDate } = user
    const userIsNotBeneficiary = !user.isBeneficiary
    const userAge = getAge(birthDate)
    const isCreditEmpty = domainsCredit?.all.remaining === 0
    const isDepositExpired = depositExpirationDate && new Date(depositExpirationDate) < new Date()
    const isEighteenOrOlder = userAge && userAge >= 18
    const isExpiredOrCreditEmpty = isDepositExpired || isCreditEmpty
    const isExpiredOrCreditEmptyWithNoUpcomingCredit = isEighteenOrOlder && isExpiredOrCreditEmpty
    return Boolean(userIsNotBeneficiary || isExpiredOrCreditEmptyWithNoUpcomingCredit)
  }
  return true
}
