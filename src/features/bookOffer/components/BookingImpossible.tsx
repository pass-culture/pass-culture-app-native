import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useNotifyWebappLinkSent } from 'features/bookOffer/services/useNotifyWebappLinkSent'
import { useAddFavorite, useFavorite } from 'features/favorites/pages/useFavorites'
import { analytics } from 'libs/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { SadFace } from 'ui/svg/icons/SadFace'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useBooking } from '../pages/BookingOfferWrapper'

export const BookingImpossible: React.FC = () => {
  const { bookingState, dismissModal } = useBooking()
  const { offerId } = bookingState
  const favorite = useFavorite({ offerId })
  const { showErrorSnackBar } = useSnackBarContext()
  const { mutate: notifyWebappLinkSent } = useNotifyWebappLinkSent({ offerId })

  useEffect(() => {
    if (typeof offerId == 'undefined') return

    analytics.logBookingImpossibleiOS(offerId)
  }, [offerId])

  const { mutate: addFavorite } = useAddFavorite({
    onSuccess: () => {
      if (typeof offerId == 'undefined') return

      analytics.logHasAddedOfferToFavorites({ from: 'bookingimpossible', offerId })
      notifyWebappLinkSent()
    },
    onError: () => {
      showErrorSnackBar({
        message: t`L'offre n'a pas été ajoutée à tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  if (typeof offerId == 'undefined') return null

  const addToFavourite = () => {
    addFavorite({ offerId })
    dismissModal()
  }

  return (
    <Container>
      <SadFace size={getSpacing(17)} color={ColorsEnum.GREY_DARK} />
      <Spacer.Column numberOfSpaces={6} />

      <Content>
        {t`Les conditions générales d'utilisation de l'App Store iOS ne permettent pas de réserver cette offre sur l'application.`}
      </Content>
      <Spacer.Column numberOfSpaces={6} />
      {!favorite ? (
        <Content>
          {t`Mets cette offre en favoris\u00a0: tu recevras une notification avec un lien pour la réserver sur notre application web\u00a0!`}
        </Content>
      ) : (
        <Content>{t`Rends-toi vite sur le site pass Culture afin de la réserver`}</Content>
      )}

      <Spacer.Column numberOfSpaces={6} />

      {!favorite && (
        <React.Fragment>
          <ButtonPrimary title={t`Mettre en favoris`} onPress={addToFavourite} />
          <Spacer.Column numberOfSpaces={4} />
          <ButtonTertiary title={t`Retourner à l'offre`} onPress={dismissModal} />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      )}
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
})
const Content = styled(Typo.Body)({ textAlign: 'center', paddingHorizontal: getSpacing(6) })
