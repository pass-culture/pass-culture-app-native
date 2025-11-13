import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useNotifyWebappLinkSentMutation } from 'features/bookOffer/queries/useNotifyWebappLinkSentMutation'
import { useFavorite } from 'features/favorites/hooks/useFavorite'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { useAddFavoriteMutation } from 'queries/favorites/useAddFavoriteMutation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Spacer, Typo } from 'ui/theme'

export const BookingImpossible: React.FC = () => {
  const { bookingState, dismissModal, dispatch } = useBookingContext()
  const { offerId } = bookingState
  const favorite = useFavorite({ offerId })
  const { navigate } = useNavigation<UseNavigationType>()
  const { mutate: notifyWebappLinkSent } = useNotifyWebappLinkSentMutation()

  useEffect(() => {
    if (typeof offerId == 'undefined') return
    analytics.logBookingImpossibleiOS(offerId)
  }, [offerId])

  // Change step to confirmation
  useEffect(() => {
    if (bookingState.step === Step.DATE) {
      dispatch({ type: 'CHANGE_STEP', payload: Step.CONFIRMATION })
    }
  }, [bookingState.step, dispatch])

  const { mutate: addFavorite } = useAddFavoriteMutation({
    onSuccess: () => {
      if (typeof offerId == 'undefined') return
      analytics.logHasAddedOfferToFavorites({ from: 'bookingimpossible', offerId })
      notifyWebappLinkSent(offerId)
    },
  })

  if (typeof offerId == 'undefined') return null

  const addToFavourite = () => {
    addFavorite({ offerId })
    dismissModal()
  }

  const navigateToOffer = () => {
    dismissModal()

    const from = 'bookingimpossible'
    triggerConsultOfferLog({ offerId, from })
    navigate('Offer', { id: offerId, from })
  }

  return (
    <Container>
      <GreySadFace />
      <Spacer.Column numberOfSpaces={6} />

      <StyledBody>
        Les conditions générales d’utilisation de l’App Store iOS ne permettent pas de réserver
        cette offre sur l’application.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />

      {favorite ? (
        <React.Fragment>
          <StyledBody>Rends-toi vite sur le site pass Culture afin de la réserver</StyledBody>
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary wording="Voir le détail de l’offre" onPress={navigateToOffer} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <StyledBody>
            Mets cette offre en favoris&nbsp;: tu recevras une notification avec un lien pour la
            réserver sur notre application web&nbsp;!
          </StyledBody>
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary wording="Mettre en favori" onPress={addToFavourite} />
          <Spacer.Column numberOfSpaces={4} />
          <ButtonTertiaryPrimary
            wording="Retourner à l’offre"
            onPress={dismissModal}
            icon={PlainArrowPrevious}
          />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={4} />
    </Container>
  )
}

const GreySadFace = styled(SadFace).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.illustrations.sizes.medium,
}))``

const Container = styled.View({
  width: '100%',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
})
const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))
