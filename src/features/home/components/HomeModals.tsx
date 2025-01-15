import React, { FC } from 'react'

import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBookings } from 'features/bookings/api'
import { IncomingReactionModalContainer } from 'features/home/components/IncomingReactionModalContainer/IncomingReactionModalContainer'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useModal } from 'ui/components/modals/useModal'

export const HomeModals: FC = () => {
  const { data: bookings, isLoading: isBookingsLoading } = useBookings()
  const { isUserLoading, user } = useAuthContext()

  const areModalReady = !isUserLoading && !isBookingsLoading

  const achievementsToShow =
    user?.achievements?.filter((achievement) => !achievement.seenDate) || []

  const bookingsEligibleToReaction =
    bookings?.ended_bookings?.filter(
      (booking) => booking.enablePopUpReaction && !booking.userReaction
    ) ?? []

  const { visible: visibleAchievementModal, hideModal: hideAchievementModal } = useModal(true)

  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)

  const firstBookingEligibleToReaction = bookingsEligibleToReaction[0]

  // There is an issue with !isCookieConsentChecked it goes to true for an instant and disrupts the modal conflict management hook
  const shouldShowReactionModal = isReactionFeatureActive && firstBookingEligibleToReaction

  const areAchievementsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const { displayAchievements } = useRemoteConfigContext()

  const unseenAchievements =
    user?.achievements?.filter((achievement) => !achievement.seenDate) || []

  const isThereAtLeastOneUnseenAchievement = unseenAchievements.length

  const shouldShowAchievementSuccessModal =
    areAchievementsEnabled && displayAchievements && isThereAtLeastOneUnseenAchievement

  if (areModalReady) {
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
        achievementsToShow={achievementsToShow}
        visible={visibleAchievementModal}
        hideModal={hideAchievementModal}
      />
    )
  }

  return null
}
