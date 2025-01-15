import React, { FC, useState } from 'react'

import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBookings } from 'features/bookings/api'
import { ModalDisplayState } from 'features/home/components/helpers/useShouldShowReactionModal'
import { IncomingReactionModalContainer } from 'features/home/components/IncomingReactionModalContainer/IncomingReactionModalContainer'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'

enum ModalToShow {
  PENDING = 'pending',
  ACHIEVEMENT = 'achievement',
  REACTION = 'reaction',
  NONE = 'none',
}

export const HomeModals: FC = () => {
  const { data: bookings, isLoading: isBookingsLoading } = useBookings()
  const { isUserLoading, user } = useAuthContext()

  const isModalContainerReady = !isUserLoading && !isBookingsLoading

  const achievementsToShow =
    user?.achievements?.filter((achievement) => !achievement.seenDate) || []

  const bookingsEligibleToReaction =
    bookings?.ended_bookings?.filter(
      (booking) => booking.enablePopUpReaction && !booking.userReaction
    ) ?? []

  const [modalToShow, setModalToShow] = useState<ModalToShow>(ModalToShow.PENDING)

  const isReactionFeatureActive = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)

  const firstBookingEligibleToReaction = bookingsEligibleToReaction[0]

  // There is an issue with !isCookieConsentChecked it goes to true for an instant and disrupts the modal conflict management hook
  const shouldShowReactionModal =
    isReactionFeatureActive && firstBookingEligibleToReaction
      ? ModalDisplayState.SHOULD_SHOW
      : ModalDisplayState.SHOULD_NOT_SHOW

  const areAchievementsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const { displayAchievements } = useRemoteConfigContext()

  const unseenAchievements =
    user?.achievements?.filter((achievement) => !achievement.seenDate) || []

  const isThereAtLeastOneUnseenAchievement = unseenAchievements.length

  const shouldShowAchievementSuccessModal =
    areAchievementsEnabled && displayAchievements && isThereAtLeastOneUnseenAchievement
      ? ModalDisplayState.SHOULD_SHOW
      : ModalDisplayState.SHOULD_NOT_SHOW

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

  if (isModalContainerReady) {
    return null
  }

  return (
    <React.Fragment>
      {modalToShow === ModalToShow.REACTION ? (
        <IncomingReactionModalContainer bookingsEligibleToReaction={bookingsEligibleToReaction} />
      ) : null}
      {modalToShow === ModalToShow.ACHIEVEMENT ? (
        <AchievementSuccessModal
          achievementsToShow={achievementsToShow}
          visible
          hideModal={() => setModalToShow(ModalToShow.NONE)}
        />
      ) : null}
    </React.Fragment>
  )
}
