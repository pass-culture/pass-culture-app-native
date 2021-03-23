import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useAddFavorite, useFavorite } from 'features/favorites/pages/useFavorites'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'
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

  const { mutate: addFavorite } = useAddFavorite({
    onSuccess: () => {
      if (typeof offerId === 'number') {
        analytics.logHasAddedOfferToFavorites({ from: 'offer', offerId })
      }
    },
    onError: () => {
      showErrorSnackBar({
        message: _(t`L'offre n'a pas été ajoutée à tes favoris`),
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const addToFavourite = () => {
    if (!favorite && typeof offerId === 'number') {
      addFavorite({ offerId })
    }
  }

  return (
    <Container>
      <SadFace size={getSpacing(17)} color={ColorsEnum.GREY_DARK} />
      <Spacer.Column numberOfSpaces={6} />

      <Content>
        {_(
          t`Les conditions générales d'utilisation de l'App Store iOS ne permettent pas de réserver cette offre sur l'application.`
        )}
      </Content>
      <Spacer.Column numberOfSpaces={6} />
      <Content>
        {_(
          t`Ajoute cette offre à tes favoris et rends-toi vite sur le site pass Culture afin de la réserver.`
        )}
      </Content>

      <Spacer.Column numberOfSpaces={6} />

      <ButtonPrimary title={_(t`Mettre en favoris`)} onPress={addToFavourite} />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiary title={_(t`Retourner à l'offre`)} onPress={dismissModal} />
      <Spacer.Column numberOfSpaces={4} />
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
