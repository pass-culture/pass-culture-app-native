import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppModal } from 'ui/components/modals/AppModal'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo } from 'ui/theme'

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
    <AppModal
      visible={visible}
      title="Débloque ton crédit pour réserver cette offre"
      rightIconAccessibilityLabel="Fermer la modale"
      rightIcon={Close}
      onRightIconPress={hideModal}>
      <Container>
        <BicolorIdCardWithMagnifyingGlass />
        <Spacer.Column numberOfSpaces={6} />
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
      </Container>
    </AppModal>
  )
}

const Container = styled.View({
  alignItems: 'center',
  width: '100%',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
