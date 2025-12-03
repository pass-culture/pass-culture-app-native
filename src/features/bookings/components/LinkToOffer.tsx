import React from 'react'

import { BookingOfferResponseV2 } from 'api/gen'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

export const LinkToOffer = ({
  offer,
  mapping,
}: {
  offer: BookingOfferResponseV2
  mapping: SubcategoriesMapping
}) => {
  const netInfo = useNetInfoContext()
  const prePopulateOffer = usePrePopulateOffer()
  const { showErrorSnackBar } = useSnackBarContext()
  const segment = useABSegment()

  const onNavigateToOfferPress = () => {
    if (netInfo.isConnected) {
      prePopulateOffer({
        ...offer,
        categoryId: mapping[offer.subcategoryId].categoryId,
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })

      triggerConsultOfferLog({ offerId: offer.id, from: 'bookings' }, segment)
    } else {
      showErrorSnackBar({
        message:
          'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }
  return (
    <InternalTouchableLink
      inline
      justifyContent="flex-start"
      enableNavigate={!!netInfo.isConnected}
      as={ButtonTertiaryBlack}
      wording="Voir l’offre"
      navigateTo={{ screen: 'Offer', params: { id: offer.id, from: 'bookingdetails' } }}
      onBeforeNavigate={onNavigateToOfferPress}
      icon={PlainArrowNext}
    />
  )
}
