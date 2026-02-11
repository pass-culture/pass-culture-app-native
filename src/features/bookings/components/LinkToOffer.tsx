import React from 'react'

import { BookingOfferResponseV2 } from 'api/gen'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
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

  const onNavigateToOfferPress = () => {
    if (netInfo.isConnected) {
      prePopulateOffer({
        ...offer,
        categoryId: mapping[offer.subcategoryId].categoryId,
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })

      triggerConsultOfferLog({ offerId: offer.id, from: 'bookings' })
    } else {
      showErrorSnackBar(
        'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.'
      )
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
