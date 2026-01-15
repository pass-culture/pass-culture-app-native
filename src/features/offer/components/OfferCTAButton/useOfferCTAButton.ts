import { useRoute } from '@react-navigation/native'

import { OfferResponseV2 } from 'api/gen'
import { UseRouteType, StepperOrigin } from 'features/navigation/RootNavigator/types'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import {
  ICTAWordingAndAction,
  useCtaWordingAndAction,
} from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { Subcategory } from 'libs/subcategories/types'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'

export const useOfferCTAButton = (
  offer: OfferResponseV2,
  subcategory: Subcategory,
  bookingData?: MovieScreeningBookingData
) => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const { from, searchId, openModalOnNavigation } = route.params

  const ctas = useCtaWordingAndAction({ offer, from, searchId, subcategory }) ?? [{}]

  const primaryCTA = ctas[0]
  const secondaryCTA = ctas[1]

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
  } = primaryCTA

  const {
    wording: secondaryWording,
    onPress: secondaryOnPressCTA,
    navigateTo: secondaryNavigateTo,
    externalNav: secondaryExternalNav,
    modalToDisplay: secondaryModalToDisplay,
    isEndedUsedBooking: secondaryIsEndedUsedBooking,
    bottomBannerText: secondaryBottomBannerText,
    isDisabled: secondaryIsDisabled,
  } = (secondaryCTA as ICTAWordingAndAction) ??
  ({
    secondaryWording: undefined,
    onPress: undefined,
    secondaryNavigateTo: undefined,
    secondaryExternalNav: undefined,
    secondaryModalToDisplay: undefined,
    secondaryIsEndedUsedBooking: undefined,
    secondaryBottomBannerText: undefined,
    secondaryIsDisabled: undefined,
  } as ICTAWordingAndAction)

  const { OfferModal: CTAOfferModal, showModal: showOfferModal } = useBookOfferModal({
    modalToDisplay,
    offerId: offer.id,
    isEndedUsedBooking,
    from: StepperOrigin.OFFER,
    bookingDataMovieScreening: bookingData,
  })

  const { OfferModal: secondaryCTAOfferModal, showModal: secondaryShowOfferModal } =
    useBookOfferModal({
      modalToDisplay: secondaryModalToDisplay,
      offerId: offer.id,
      isEndedUsedBooking: secondaryIsEndedUsedBooking,
      from: StepperOrigin.OFFER,
    })

  const onPress = () => {
    onPressCTA?.()
    if (modalToDisplay) showOfferModal()
  }

  const onPressSecondary = () => {
    secondaryOnPressCTA?.()
    secondaryShowOfferModal()
  }

  const ctaWordingAndAction = {
    wording,
    onPress,
    navigateTo,
    externalNav,
    isDisabled,
    bottomBannerText,
  }

  const secondaryCtaWordingAndAction = secondaryCTA
    ? {
        wording: secondaryWording,
        onPress: onPressSecondary,
        navigateTo: secondaryNavigateTo,
        externalNav: secondaryExternalNav,
        isDisabled: secondaryIsDisabled,
        bottomBannerText: secondaryBottomBannerText,
      }
    : undefined

  return {
    ctaWordingAndAction,
    onPress,
    showOfferModal,
    CTAOfferModal,
    openModalOnNavigation,
    movieScreeningUserData,
    onPressSecondary,
    secondaryCtaWordingAndAction,
    secondaryCTAOfferModal,
    secondaryShowOfferModal,
  }
}
