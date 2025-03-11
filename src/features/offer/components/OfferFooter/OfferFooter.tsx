import React, { ReactNode } from 'react'
import { useTheme } from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { CineContentCTA } from 'features/offer/components/OfferCine/CineContentCTA'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { StickyFooterContent } from 'features/offer/components/OfferFooter/StickyFooterContent'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { FavoriteProps } from 'features/offer/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'

export type OfferFooterProps = {
  offer: OfferResponseV2
  children: ReactNode
} & FavoriteProps

export const OfferFooter = ({
  offer,
  addFavorite,
  isAddFavoriteLoading,
  removeFavorite,
  isRemoveFavoriteLoading,
  favorite,
  children,
}: OfferFooterProps) => {
  const { isDesktopViewport } = useTheme()
  const { isButtonVisible } = useOfferCTA()
  const { showAccessScreeningButton } = useRemoteConfigQuery()

  const isAComingSoonOffer = getIsAComingSoonOffer(offer)

  if (showAccessScreeningButton && isButtonVisible) {
    return <CineContentCTA />
  }

  if (isAComingSoonOffer && !isDesktopViewport) {
    return (
      <StickyFooterContent
        offerId={offer.id}
        addFavorite={addFavorite}
        isAddFavoriteLoading={isAddFavoriteLoading}
        removeFavorite={removeFavorite}
        isRemoveFavoriteLoading={isRemoveFavoriteLoading}
        favorite={favorite}
      />
    )
  }

  return <React.Fragment>{isDesktopViewport ? null : children}</React.Fragment>
}
