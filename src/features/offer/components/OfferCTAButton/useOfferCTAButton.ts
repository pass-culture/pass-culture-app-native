import { useRoute } from '@react-navigation/native'

import { OfferResponse } from 'api/gen'
import { UseRouteType, StepperOrigin } from 'features/navigation/RootNavigator/types'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { useCtaWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { Subcategory } from 'libs/subcategories/types'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'

export const useOfferCTAButton = (
  offer: OfferResponse,
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
