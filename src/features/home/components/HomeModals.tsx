import React, { FC } from 'react'

import { useShouldShowAchievementSuccessModal } from 'features/achievements/hooks/useShouldShowAchievementSuccessModal'
import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBookings } from 'features/bookings/api'
import { useShouldShowReactionModal } from 'features/home/components/helpers/useShouldShowReactionModal'
import { IncomingReactionModalContainer } from 'features/home/components/IncomingReactionModalContainer/IncomingReactionModalContainer'
import { useModal } from 'ui/components/modals/useModal'

export const HomeModals: FC = () => {
  const { data: bookings, isLoading: isBookingsLoading } = useBookings()
  const { isUserLoading, user } = useAuthContext()

  const areModalsReady = !isUserLoading && !isBookingsLoading

  const unseenAchievements =
    user?.achievements?.filter((achievement) => !achievement.seenDate) || []

  const bookingsEligibleToReaction =
    bookings?.ended_bookings?.filter(
      (booking) => booking.enablePopUpReaction && !booking.userReaction
    ) ?? []

  const { visible: visibleAchievementModal, hideModal: hideAchievementModal } = useModal(true)

  const shouldShowReactionModal = useShouldShowReactionModal(bookingsEligibleToReaction)
  const shouldShowAchievementSuccessModal = useShouldShowAchievementSuccessModal(unseenAchievements)

  if (areModalsReady) {
    return null
  }

  if (shouldShowReactionModal) {
    return (
      <IncomingReactionModalContainer bookingsEligibleToReaction={bookingsEligibleToReaction} />
    )
  }

  if (shouldShowAchievementSuccessModal) {
    return (
      <AchievementSuccessModal
        achievementsToShow={unseenAchievements}
        visible={visibleAchievementModal}
        hideModal={hideAchievementModal}
      />
    )
  }

  return null
}
