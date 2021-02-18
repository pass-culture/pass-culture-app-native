import { useUserProfileInfo } from 'features/home/api'
import { computeWalletBalance } from 'features/profile/utils'

export const useAvailableCredit = (): number | undefined => {
  const { data: user } = useUserProfileInfo()
  return user ? computeWalletBalance(user.expenses) : undefined
}
