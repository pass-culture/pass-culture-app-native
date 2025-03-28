import React, { FC, ReactNode } from 'react'
import { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { CineContentCTA } from 'features/offer/components/OfferCine/CineContentCTA'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { StickyFooterContent } from 'features/offer/components/OfferContent/StickyFooterContent/StickyFooterContent'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { useAddReminderMutation } from 'features/offer/mutations/useAddReminderMutation'
import { useDeleteReminderMutation } from 'features/offer/mutations/useDeleteReminderMutation'
import { selectReminderByOfferId } from 'features/offer/queries/selectors/selectReminderByOfferId'
import { useGetRemindersQuery } from 'features/offer/queries/useGetRemindersQuery'
import { FavoriteProps } from 'features/offer/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export type OfferFooterProps = {
  offer: OfferResponseV2
  children: ReactNode
} & FavoriteProps

export const OfferFooter: FC<OfferFooterProps> = ({
  offer,
  addFavorite,
  isAddFavoriteLoading,
  removeFavorite,
  isRemoveFavoriteLoading,
  favorite,
  children,
}) => {
  const { showErrorSnackBar } = useSnackBarContext()

  const { isLoggedIn } = useAuthContext()

  const { isDesktopViewport } = useTheme()
  const { isButtonVisible } = useOfferCTA()
  const { showAccessScreeningButton } = useRemoteConfigQuery()

  const { data: reminder } = useGetRemindersQuery((data) => selectReminderByOfferId(data, offer.id))
  const hasReminder = !!reminder

  const { mutate: addReminder, isLoading: isAddReminderLoading } = useAddReminderMutation({
    onError: () => {
      showErrorSnackBar({
        message: 'L’offre n’a pas pu être ajoutée à tes rappels',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const { mutate: deleteReminder, isLoading: isDeleteReminderLoading } = useDeleteReminderMutation({
    onError: () => {
      showErrorSnackBar({
        message: 'L’offre n’a pas pu être retirée de tes rappels',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const favoriteAuthModal = useModal(false)

  const onPressFavoriteCTA = () => {
    if (!isLoggedIn) return favoriteAuthModal.showModal()
    return favorite ? removeFavorite(favorite.id) : addFavorite({ offerId: offer.id })
  }

  const reminderAuthModal = useModal(false)

  const onPressReminderCTA = () => {
    if (!isLoggedIn) return reminderAuthModal.showModal()
    return hasReminder ? deleteReminder(reminder.id) : addReminder(offer.id)
  }

  const isAComingSoonOffer = getIsAComingSoonOffer(offer)

  if (showAccessScreeningButton && isButtonVisible) {
    return <CineContentCTA />
  }

  if (isAComingSoonOffer && !isDesktopViewport) {
    return (
      <StickyFooterContent
        offerId={offer.id}
        favorite={favorite}
        onPressFavoriteCTA={onPressFavoriteCTA}
        isAddFavoriteLoading={isAddFavoriteLoading}
        isRemoveFavoriteLoading={isRemoveFavoriteLoading}
        hasReminder={hasReminder}
        onPressReminderCTA={onPressReminderCTA}
        favoriteAuthModal={favoriteAuthModal}
        reminderAuthModal={reminderAuthModal}
        areRemindersLoading={isAddReminderLoading || isDeleteReminderLoading}
      />
    )
  }

  return <React.Fragment>{isDesktopViewport ? null : children}</React.Fragment>
}
