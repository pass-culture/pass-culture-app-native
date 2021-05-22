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
    if (typeof offerId === 'number') {
      analytics.logBookingImpossibleiOS(offerId)
    }
  }, [])

  const { mutate: addFavorite } = useAddFavorite({
    onSuccess: () => {
      if (typeof offerId === 'number') {
        analytics.logHasAddedOfferToFavorites({ from: 'BookingImpossible', offerId })
      }
      notifyWebappLinkSent()
    },
    onError: () => {
      showErrorSnackBar({
        message: t`L'offre n'a pas été ajoutée à tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const addToFavourite = () => {
    if (!favorite && typeof offerId === 'number') {
      addFavorite({ offerId })
      dismissModal()
    }
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
          {t`Ajoute cette offre à tes favoris et rends-toi vite sur le site pass Culture afin de la réserver.`}
        </Content>
      ) : (
        <Content>{t`Met cette offre en favoris : tu recevras une notification avec un lien pour la réserver sur notre application web !`}</Content>
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
