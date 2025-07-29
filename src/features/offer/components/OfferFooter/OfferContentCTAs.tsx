import React, { FC, PropsWithChildren } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { CineContentCTA } from 'features/offer/components/OfferCine/CineContentCTA'
import { FavoritesCTA } from 'features/offer/components/OfferContent/ComingSoonCTAs/FavoritesCTA'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { StickyFooterContent } from 'features/offer/components/OfferContent/StickyFooterContent/StickyFooterContent'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { selectReminderByOfferId } from 'features/offer/queries/selectors/selectReminderByOfferId'
import { useAddReminderMutation } from 'features/offer/queries/useAddReminderMutation'
import { useDeleteReminderMutation } from 'features/offer/queries/useDeleteReminderMutation'
import { useGetRemindersQuery } from 'features/offer/queries/useGetRemindersQuery'
import { FavoriteProps } from 'features/offer/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export type Props = PropsWithChildren<{
  offer: OfferResponseV2
  onLayout?: (params: LayoutChangeEvent) => void
}> &
  FavoriteProps

export const OfferContentCTAs: FC<Props> = ({
  offer,
  addFavorite,
  isAddFavoriteLoading,
  removeFavorite,
  isRemoveFavoriteLoading,
  favorite,
  onLayout,
  children,
}) => {
  const { showErrorSnackBar } = useSnackBarContext()

  const { isLoggedIn } = useAuthContext()

  const { isDesktopViewport, isMobileViewport } = useTheme()
  const { isButtonVisible } = useOfferCTA()
  const { showAccessScreeningButton } = useRemoteConfigQuery()

  const { data: reminder } = useGetRemindersQuery((data) => selectReminderByOfferId(data, offer.id))
  const hasReminder = !!reminder

  const { mutate: addReminder } = useAddReminderMutation({
    onError: () => {
      showErrorSnackBar({
        message: 'L’offre n’a pas pu être ajoutée à tes rappels',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const { mutate: deleteReminder } = useDeleteReminderMutation({
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

  const isAComingSoonOffer = getIsAComingSoonOffer(offer.bookingAllowedDatetime)

  if (isDesktopViewport && isAComingSoonOffer) {
    return (
      <FavoritesCTA
        offerId={offer.id}
        favorite={favorite}
        onPressFavoriteCTA={onPressFavoriteCTA}
        isAddFavoriteLoading={isAddFavoriteLoading}
        isRemoveFavoriteLoading={isRemoveFavoriteLoading}
        favoriteAuthModal={favoriteAuthModal}
        caption="Cette offre sera bientôt disponible"
      />
    )
  }

  if (isMobileViewport) {
    if (showAccessScreeningButton && isButtonVisible) {
      return <CineContentCTA />
    }

    if (isAComingSoonOffer) {
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
          onLayout={onLayout}
        />
      )
    }
  }

  return <React.Fragment>{children}</React.Fragment>
}
