import { isBefore, subWeeks } from 'date-fns'

import { ShareAppModalTrigger } from '../useShareAppModaleTrigger'

type Params = {
  currentDate: Date
  firstCreditDate?: Date
}
export const twoWeeksAfterCreditTrigger =
  ({ currentDate, firstCreditDate }: Params): ShareAppModalTrigger =>
  () => {
    if (!firstCreditDate) return false
    const twoWeeksBeforeCurrentDate = subWeeks(currentDate, 2)
    const hasReceivedCreditMoreThan2WeeksAgo = isBefore(firstCreditDate, twoWeeksBeforeCurrentDate)
    return hasReceivedCreditMoreThan2WeeksAgo
  }
