import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { Referrals, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { AddToFavoritesButton } from 'features/offer/components/AddToFavoritesButton/AddToFavoritesButton'
import { analytics } from 'libs/firebase/analytics'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { BicolorUserError } from 'ui/svg/BicolorUserError'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK, LINE_BREAK } from 'ui/theme/constants'

type Props = {
  visible: boolean
  hideModal: () => void
  offerId: number
  children?: never
}

export const ErrorApplicationModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  offerId,
}) => {
  const addToFavorites = useCallback(() => {
    analytics.logHasAddedOfferToFavorites({
      from: 'ErrorApplicationModal' as Referrals,
      offerId,
    })
    hideModal()
  }, [hideModal, offerId])

  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToProfile = () => {
    analytics.logGoToProfil({ from: 'ErrorApplicationModal', offerId })
    hideModal()
    navigate(...getTabNavConfig('Profile'))
  }

  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Tu n’as pas encore obtenu' + LINE_BREAK + 'ton crédit'}
      Illustration={BicolorUserError}
      hideModal={hideModal}>
      <StyledBody>
        Ton dossier n’a pas pu être validé. Sans crédit, tu ne peux pas réserver cette offre.
        {DOUBLE_LINE_BREAK}
        Pour terminer ton inscription et obtenir ton crédit, va sur ton profil.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Aller sur mon profil"
        accessibilityLabel="Aller vers la section profil"
        onPress={navigateToProfile}
      />
      <AddToFavoritesButton offerId={offerId} onFavoriteAdditionnalPress={addToFavorites} />
    </AppModalWithIllustration>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
