import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { useCallback } from 'react'
import { useTheme } from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import {
  StepperOrigin,
  UseNavigationType,
  UseRouteType,
} from 'features/navigation/RootNavigator/types'
import { useOfferCTA } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { useCtaWordingAndAction } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { selectReminderByOfferId } from 'features/offer/queries/selectors/selectReminderByOfferId'
import { useAddReminderMutation } from 'features/offer/queries/useAddReminderMutation'
import { useDeleteReminderMutation } from 'features/offer/queries/useDeleteReminderMutation'
import { useGetRemindersQuery } from 'features/offer/queries/useGetRemindersQuery'
import { getIsAComingSoonOffer, getIsFreeDigitalOffer } from 'features/offerRefacto/helpers'
import { FavoriteCTAProps, OfferCTAsViewModel } from 'features/offerRefacto/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { Subcategory } from 'libs/subcategories/types'
import { useBookOfferModal } from 'shared/offer/helpers/useBookOfferModal'
import { useModal } from 'ui/components/modals/useModal'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type UseOfferCTAsParams = {
  offer: OfferResponse
  subcategory: Subcategory
  trackEventHasSeenOfferOnce: VoidFunction
  favoriteCTAProps: FavoriteCTAProps
}

export const useOfferCTAs = ({
  offer,
  subcategory,
  trackEventHasSeenOfferOnce,
  favoriteCTAProps,
}: UseOfferCTAsParams): OfferCTAsViewModel => {
  const { isLoggedIn } = useAuthContext()
  const theme = useTheme()
  const { isMobileViewport } = theme
  const { setParams } = useNavigation<UseNavigationType>()
  const route = useRoute<UseRouteType<'Offer'>>()
  const { from, searchId, openModalOnNavigation } = route.params ?? {}
  const { addFavorite, removeFavorite, favorite } = favoriteCTAProps

  const { isButtonVisible: isCineButtonVisible } = useOfferCTA()
  const {
    data: { showAccessScreeningButton },
  } = useRemoteConfigQuery()

  const { data: reminder } = useGetRemindersQuery((data) => selectReminderByOfferId(data, offer.id))

  const { mutate: addReminder } = useAddReminderMutation({
    onError: () => {
      showErrorSnackBar('L’offre n’a pas pu être ajoutée à tes rappels')
    },
  })

  const { mutate: deleteReminder } = useDeleteReminderMutation({
    onError: () => {
      showErrorSnackBar('L’offre n’a pas pu être retirée de tes rappels')
    },
  })

  const isFreeDigitalOffer = getIsFreeDigitalOffer(offer)
  const isAComingSoonOffer = getIsAComingSoonOffer(offer.bookingAllowedDatetime)
  const showCineCTA = isMobileViewport && showAccessScreeningButton && isCineButtonVisible

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

  const favoriteAuthModal = useModal(false)
  const reminderAuthModal = useModal(false)
  const { OfferModal: CTAOfferModal, showModal: showOfferModal } = useBookOfferModal({
    modalToDisplay,
    offerId: offer.id,
    isEndedUsedBooking,
    from: StepperOrigin.OFFER,
  })

  const handleOnPress = useCallback(() => {
    onPressCTA?.()
    if (modalToDisplay) showOfferModal()
  }, [modalToDisplay, onPressCTA, showOfferModal])

  const handleOnFavoritePress = useCallback(() => {
    if (!isLoggedIn) return favoriteAuthModal.showModal()
    return favorite ? removeFavorite(favorite.id) : addFavorite({ offerId: offer.id })
  }, [addFavorite, favorite, favoriteAuthModal, isLoggedIn, offer.id, removeFavorite])

  const handleOnReminderPress = useCallback(() => {
    if (!isLoggedIn) return reminderAuthModal.showModal()
    return reminder ? deleteReminder(reminder.id) : addReminder(offer.id)
  }, [addReminder, deleteReminder, isLoggedIn, offer.id, reminder, reminderAuthModal])

  useFocusEffect(
    useCallback(() => {
      trackEventHasSeenOfferOnce()
      if (openModalOnNavigation) {
        showOfferModal()
        setParams({ openModalOnNavigation: undefined })
      }
    }, [trackEventHasSeenOfferOnce, openModalOnNavigation, showOfferModal, setParams])
  )

  const ctaProps = {
    wording,
    onPress: handleOnPress,
    onFavoritePress: handleOnFavoritePress,
    onReminderPress: handleOnReminderPress,
    navigateTo,
    externalNav,
    isDisabled,
    bottomBannerText,
  }

  return {
    ctaProps,
    CTAOfferModal,
    theme,
    isFreeDigitalOffer,
    isAComingSoonOffer,
    isLoggedIn,
    showCineCTA,
    reminder,
    movieScreeningUserData,
    favoriteAuthModal,
    reminderAuthModal,
  }
}
