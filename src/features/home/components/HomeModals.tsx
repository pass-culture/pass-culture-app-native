import React, { FC, useState } from 'react'

import { useShouldShowAchievementSuccessModal } from 'features/achievements/hooks/useShouldShowAchievementSuccessModal'
import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBookings } from 'features/bookings/api'
import {
  ModalDisplayState,
  useShouldShowReactionModal,
} from 'features/home/components/helpers/useShouldShowReactionModal'
import { IncomingReactionModalContainer } from 'features/home/components/IncomingReactionModalContainer/IncomingReactionModalContainer'

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
  const shouldShowReactionModal = useShouldShowReactionModal(bookings, isBookingsLoading)
  const shouldShowAchievementSuccessModal = useShouldShowAchievementSuccessModal()
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
