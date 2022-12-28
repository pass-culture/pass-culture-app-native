import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { Referrals } from 'features/navigation/RootNavigator/types'
import { AddToFavoritesButton } from 'features/offer/components/AddToFavoritesButton/AddToFavoritesButton'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
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
  const addToFavorites = useCallback(() => {
    analytics.logHasAddedOfferToFavorites({
      from: 'ApplicationProcessingModal' as Referrals,
      offerId,
    })
    hideModal()
  }, [hideModal, offerId])

  const goToProfil = useCallback(() => {
    analytics.logGoToProfil({ from: 'ApplicationProcessingModal', offerId })
    hideModal()
  }, [hideModal, offerId])

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
      <InternalTouchableLink
        as={ButtonPrimary}
        wording="Aller sur mon profil"
        navigateTo={{ screen: 'TabNavigator', params: { screen: 'Profile' } }}
        onBeforeNavigate={goToProfil}
      />
      <AddToFavoritesButton offerId={offerId} onFavoriteAdditionnalPress={addToFavorites} />
    </AppModalWithIllustration>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
