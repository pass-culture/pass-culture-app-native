import React, { FC, ReactNode, useCallback, useState } from 'react'
import { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { CineContentCTA } from 'features/offer/components/OfferCine/CineContentCTA'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { StickyFooterContent } from 'features/offer/components/OfferFooter/StickyFooterContent'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { FavoriteProps } from 'features/offer/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useModal } from 'ui/components/modals/useModal'

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
  const [hasEnabledNotifications, setHasEnabledNotifications] = useState(false)

  const { isLoggedIn } = useAuthContext()

  const { isDesktopViewport } = useTheme()
  const { isButtonVisible } = useOfferCTA()
  const { showAccessScreeningButton } = useRemoteConfigQuery()

  const isAComingSoonOffer = getIsAComingSoonOffer(offer)

  const favoriteAuthModal = useModal(false)

  const onPressFavoriteCTA = useCallback(() => {
    if (!isLoggedIn) {
      favoriteAuthModal.showModal()
    } else if (favorite) {
      removeFavorite(favorite.id)
    } else {
      addFavorite({ offerId: offer.id })
    }
  }, [addFavorite, favorite, favoriteAuthModal, isLoggedIn, offer.id, removeFavorite])

  const notificationAuthModal = useModal(false)

  const onPressNotificationsCTA = () => {
    if (!isLoggedIn) {
      notificationAuthModal.showModal()
    }
    setHasEnabledNotifications(!hasEnabledNotifications)
  }

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
        hasEnabledNotifications={hasEnabledNotifications}
        onPressNotificationsCTA={onPressNotificationsCTA}
        favoriteAuthModal={favoriteAuthModal}
        notificationAuthModal={notificationAuthModal}
      />
    )
  }

  return <React.Fragment>{isDesktopViewport ? null : children}</React.Fragment>
}
