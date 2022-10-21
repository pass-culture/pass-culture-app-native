import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Typo, Spacer } from 'ui/theme'

type Props = {
  visible: boolean
  hideModal: () => void
}

export const FinishSubscriptionModal: FunctionComponent<Props> = ({ visible, hideModal }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToProfile = () => {
    hideModal()
    navigate(...getTabNavConfig('Profile'))
  }

  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Débloque ton crédit pour réserver cette offre'}
      Illustration={BicolorIdCardWithMagnifyingGlass}
      hideModal={hideModal}>
      <StyledBody>
        Finalise ton inscription pour obtenir ton crédit de
        <Typo.ButtonText> 30€ </Typo.ButtonText>
        et réserver cette offre.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary
        wording="Terminer mon inscription"
        accessibilityLabel="Aller vers la section profil"
        onPress={navigateToProfile}
        mediumWidth
      />
    </AppModalWithIllustration>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
