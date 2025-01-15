import { useState } from 'react'

import { BookingsResponse } from 'api/gen'
import { useShouldShowAchievementSuccessModal } from 'features/achievements/hooks/useShouldShowAchievementSuccessModal'
import {
  ModalDisplayState,
  useBookingsReactionHelpers,
} from 'features/home/components/helpers/useBookingsReactionHelpers'

export enum ModalToShow {
  PENDING = 'pending',
  ACHIEVEMENT = 'achievement',
  REACTION = 'reaction',
  NONE = 'none',
}

export const useWhichModalToShow = (
  bookings: BookingsResponse | undefined,
  isBookingsLoading: boolean
) => {
  const [modalToShow, setModalToShow] = useState<ModalToShow>(ModalToShow.PENDING)
  const { shouldShowReactionModal } = useBookingsReactionHelpers(bookings, isBookingsLoading)
  const { shouldShowAchievementSuccessModal } = useShouldShowAchievementSuccessModal()
  if (!isBookingsLoading && modalToShow === ModalToShow.PENDING) {
    if (shouldShowReactionModal === ModalDisplayState.SHOULD_SHOW) {
      setModalToShow(ModalToShow.REACTION)
    } else if (shouldShowAchievementSuccessModal === ModalDisplayState.SHOULD_SHOW) {
      setModalToShow(ModalToShow.ACHIEVEMENT)
    } else if (
      shouldShowReactionModal === ModalDisplayState.SHOULD_NOT_SHOW &&
      shouldShowAchievementSuccessModal === ModalDisplayState.SHOULD_NOT_SHOW
    ) {
      setModalToShow(ModalToShow.NONE)
    }
  }

  return { modalToShow }
}
