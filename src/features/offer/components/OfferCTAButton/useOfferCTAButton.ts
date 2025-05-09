import { useRoute, useFocusEffect } from '@react-navigation/native'

import { OfferResponseV2 } from 'api/gen'
import { UseRouteType, StepperOrigin } from 'features/navigation/RootNavigator/types'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { useCtaWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { freeOfferIdActions, useFreeOfferId } from 'features/offer/store/freeOfferIdStore'
import { Subcategory } from 'libs/subcategories/types'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'

export const useOfferCTAButton = (
  offer: OfferResponseV2,
  subcategory: Subcategory,
  bookingData?: MovieScreeningBookingData
) => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const { from, searchId, openModalOnNavigation } = route.params

  const {
    wording,
    onPress: onPressCTA,
    navigateTo,
    externalNav,
    modalToDisplay,
    isEndedUsedBooking,
    bottomBannerText,
    isDisabled,
    movieScreeningUserData,
  } = useCtaWordingAndAction({ offer, from, searchId, subcategory }) ?? {}

  const { OfferModal: CTAOfferModal, showModal: showOfferModal } = useBookOfferModal({
    modalToDisplay,
    offerId: offer.id,
    isEndedUsedBooking,
    from: StepperOrigin.OFFER,
    bookingDataMovieScreening: bookingData,
  })

  const { resetFreeOfferId } = freeOfferIdActions
  const storedFreeOfferId = useFreeOfferId()

  useFocusEffect(() => {
    if (storedFreeOfferId) {
      resetFreeOfferId()
      showOfferModal()
    }
  })

  const onPress = () => {
    onPressCTA?.()
    showOfferModal()
  }

  const ctaWordingAndAction = {
    wording,
    onPress,
    navigateTo,
    externalNav,
    isDisabled,
    bottomBannerText,
  }

  return {
    ctaWordingAndAction,
    onPress,
    showOfferModal,
    CTAOfferModal,
    openModalOnNavigation,
    movieScreeningUserData,
  }
}
