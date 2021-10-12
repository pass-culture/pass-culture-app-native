import { Credit } from 'features/home/services/useAvailableCredit'

export const nonExpiredCredit: Credit = { amount: 10, isExpired: false }
export const expiredCredit: Credit = { ...nonExpiredCredit, isExpired: true }
