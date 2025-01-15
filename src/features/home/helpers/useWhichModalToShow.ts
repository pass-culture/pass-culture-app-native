import { useState } from 'react'

import { useShouldShowAchievementSuccessModal } from 'features/achievements/hooks/useShouldShowAchievementSuccessModal'
import { useBookings } from 'features/bookings/api'
import {
  ModalDisplayState,
  useShouldShowReactionModal,
} from 'features/home/components/helpers/useShouldShowReactionModal'

export enum ModalToShow {
  PENDING = 'pending',
  ACHIEVEMENT = 'achievement',
  REACTION = 'reaction',
  NONE = 'none',
}

export const useWhichModalToShow = () => {
  const [modalToShow, setModalToShow] = useState<ModalToShow>(ModalToShow.PENDING)
  const { isLoading: isBookingsLoading } = useBookings()
  const shouldShowReactionModal = useShouldShowReactionModal()
  const { shouldShowAchievementSuccessModal, achievementsToShow } =
    useShouldShowAchievementSuccessModal()
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

  return { modalToShow, achievementsToShow }
}
