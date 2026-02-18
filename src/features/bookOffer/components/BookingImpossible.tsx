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
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Typo } from 'ui/theme'

export const BookingImpossible: React.FC = () => {
  const { bookingState, dismissModal, dispatch } = useBookingContext()
  const { offerId } = bookingState
  const favorite = useFavorite({ offerId })
  const { navigate } = useNavigation<UseNavigationType>()
  const { mutate: notifyWebappLinkSent } = useNotifyWebappLinkSentMutation()

  useEffect(() => {
    if (offerId === undefined) return
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
      if (offerId === undefined) return
      analytics.logHasAddedOfferToFavorites({ from: 'bookingimpossible', offerId })
      notifyWebappLinkSent(offerId)
    },
  })

  if (offerId === undefined) return null

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

      <StyledBodyHeader>
        Les conditions générales d’utilisation de l’App Store iOS ne permettent pas de réserver
        cette offre sur l’application.
      </StyledBodyHeader>

      {favorite ? (
        <React.Fragment>
          <StyledBody>Rends-toi vite sur le site pass Culture afin de la réserver</StyledBody>
          <Button wording="Voir le détail de l’offre" onPress={navigateToOffer} fullWidth />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <StyledBody>
            Mets cette offre en favoris&nbsp;: tu recevras une notification avec un lien pour la
            réserver sur notre application web&nbsp;!
          </StyledBody>
          <ViewGap gap={4}>
            <Button wording="Mettre en favori" onPress={addToFavourite} fullWidth />
            <Button
              wording="Retourner à l’offre"
              onPress={dismissModal}
              icon={PlainArrowPrevious}
              variant="tertiary"
              color="brand"
              fullWidth
            />
          </ViewGap>
        </React.Fragment>
      )}
    </Container>
  )
}

const GreySadFace = styled(SadFace).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.illustrations.sizes.medium,
}))``

const Container = styled.View(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  marginBottom: theme.designSystem.size.spacing.l,
}))
const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.xl,
}))
const StyledBodyHeader = styled(StyledBody)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
