import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type Props = StackScreenProps<SubscriptionRootStackParamList, 'SetProfileBookingError'>

export const SetProfileBookingError: FunctionComponent<Props> = ({ route }: Props) => {
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()

  const offerId = route.params.offerId

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
