import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { AddToFavoritesButton } from 'features/offer/components/AddToFavoritesButton/AddToFavoritesButton'
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
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToProfile = () => {
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
      <AddToFavoritesButton offerId={offerId} />
    </AppModalWithIllustration>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
