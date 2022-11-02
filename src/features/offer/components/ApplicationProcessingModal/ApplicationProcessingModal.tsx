import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AddToFavoritesButton } from 'features/offer/components/AddToFavoritesButton/AddToFavoritesButton'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { BicolorBookingHold } from 'ui/svg/BicolorBookingHold'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

interface Props {
  visible: boolean
  hideModal: () => void
  offerId: number
  children?: never
}

export const ApplicationProcessingModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  offerId,
}) => {
  return (
    <AppModalWithIllustration
      hideModal={hideModal}
      visible={visible}
      Illustration={BicolorBookingHold}
      title="C'est pour bientôt&nbsp;!">
      <StyledBody>
        Nous avons reçu ton dossier et son analyse est en cours. Tu pourras réserver cette offre dès
        que tu auras obtenu ton crédit.
        {DOUBLE_LINE_BREAK}
        Pour en savoir plus, va sur ton profil.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <TouchableLink
        as={ButtonPrimary}
        wording="Aller sur mon profil"
        navigateTo={{ screen: 'TabNavigator', params: { screen: 'Profile' } }}
        onBeforeNavigate={hideModal}
      />
      <AddToFavoritesButton offerId={offerId} onFavoriteAdditionnalPress={hideModal} />
    </AppModalWithIllustration>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
