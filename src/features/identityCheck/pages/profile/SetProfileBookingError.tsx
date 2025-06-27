import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

export const SetProfileBookingError = () => {
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()
  const { params } = useRoute<UseRouteType<'SetProfileBookingError'>>()

  const offerId = params.offerId

  const navigateToHomeButton = {
    wording: 'Retourner à l’accueil',
    onPress: navigateToHomeWithReset,
  }

  return (
    <GenericInfoPage
      illustration={SadFace}
      title={`Oups...${LINE_BREAK}Un problème est survenu\u00a0!`}
      buttonPrimary={
        offerId
          ? {
              wording: 'Revenir vers l’offre',
              navigateTo: {
                screen: 'Offer',
                params: { id: offerId },
                withReset: true,
              },
            }
          : navigateToHomeButton
      }
      buttonSecondary={offerId ? navigateToHomeButton : undefined}>
      <StyledBody>
        Il semble que ta connexion ait été interrompue ou qu’un problème technique soit survenu.
      </StyledBody>
      <StyledBody>Tu peux réessayer d’envoyer ta demande maintenant.</StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
