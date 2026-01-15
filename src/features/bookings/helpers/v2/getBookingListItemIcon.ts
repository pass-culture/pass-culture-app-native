import { WithdrawalTypeEnum } from 'api/gen'

export const getBookingListItemIcon = ({ isDigital, withdrawalType }) => {
  if (isDigital) return 'digital'
  if (withdrawalType === WithdrawalTypeEnum.on_site) return 'tickets'

  return 'clock'
}
