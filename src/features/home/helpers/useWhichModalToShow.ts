import { useState } from 'react'

import { BookingsResponseV2 } from 'api/gen'
import { useShouldShowAchievementSuccessModal } from 'features/achievements/hooks/useShouldShowAchievementSuccessModal'
import { useIsCookiesListUpToDate } from 'features/cookies/helpers/useIsCookiesListUpToDate'
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
  bookings: BookingsResponseV2 | undefined,
  isBookingsLoading: boolean
) => {
  const [modalToShow, setModalToShow] = useState<ModalToShow>(ModalToShow.PENDING)
  const { shouldShowReactionModal, bookingsEligibleToReaction } = useBookingsReactionHelpers(
    bookings,
    isBookingsLoading
  )
  const { shouldShowAchievementSuccessModal, achievementsToShow } =
    useShouldShowAchievementSuccessModal()
  const { isCookiesListUpToDate, isLoading: isCookiesListUpToDateLoading } =
    useIsCookiesListUpToDate()
  const shouldShowCookiesModal = !isCookiesListUpToDate

  if (!isCookiesListUpToDateLoading && !isBookingsLoading && modalToShow === ModalToShow.PENDING) {
    if (shouldShowCookiesModal) {
      setModalToShow(ModalToShow.NONE)
    } else if (shouldShowReactionModal === ModalDisplayState.SHOULD_SHOW) {
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

  return { modalToShow, bookingsEligibleToReaction, achievementsToShow }
}
