import React from 'react'

import { BookingOfferResponseV2 } from 'api/gen'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { AB_TESTS } from 'shared/useABSegment/abTests'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const LinkToOffer = ({
  offer,
  mapping,
}: {
  offer: BookingOfferResponseV2
  mapping: SubcategoriesMapping
}) => {
  const netInfo = useNetInfoContext()
  const prePopulateOffer = usePrePopulateOffer()
  const proAdvicesOnOfferSegment = useABSegment(AB_TESTS.PRO_REVIEWS_ON_OFFER)

  const onNavigateToOfferPress = () => {
    if (netInfo.isConnected) {
      prePopulateOffer({
        ...offer,
        categoryId: mapping[offer.subcategoryId].categoryId,
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })

      triggerConsultOfferLog({
        offerId: offer.id,
        venueId: offer.venue.id,
        from: 'bookings',
        displayAdvice: proAdvicesOnOfferSegment === 'A',
      })
    } else {
      showErrorSnackBar(
        'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.'
      )
    }
  }
  return (
    <InternalTouchableLink
      enableNavigate={!!netInfo.isConnected}
      as={Button}
      wording="Voir l’offre"
      navigateTo={{ screen: 'Offer', params: { id: offer.id, from: 'bookingdetails' } }}
      onBeforeNavigate={onNavigateToOfferPress}
      variant="secondary"
      color="neutral"
      fullWidth
    />
  )
}
