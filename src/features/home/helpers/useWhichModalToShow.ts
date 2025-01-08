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

export const useWhichModalToShow = (bookings: BookingsResponse | undefined = undefined) => {
  const [showModal, setShowModal] = useState<ModalToShow>(ModalToShow.PENDING)
  const { shouldShowReactionModal, bookingsEligibleToReaction } =
    useBookingsReactionHelpers(bookings)
  const { shouldShowAchievementSuccessModal, achievementsToShow } =
    useShouldShowAchievementSuccessModal()

  if (bookings !== undefined && showModal === ModalToShow.PENDING) {
    if (shouldShowReactionModal === ModalDisplayState.SHOULD_SHOW) {
      setShowModal(ModalToShow.REACTION)
    } else if (shouldShowAchievementSuccessModal === ModalDisplayState.SHOULD_SHOW) {
      setShowModal(ModalToShow.ACHIEVEMENT)
    } else if (
      shouldShowReactionModal === ModalDisplayState.SHOULD_NOT_SHOW &&
      shouldShowAchievementSuccessModal === ModalDisplayState.SHOULD_NOT_SHOW
    ) {
      setShowModal(ModalToShow.NONE)
    }
  }

  return { showModal, bookingsEligibleToReaction, achievementsToShow }
}
