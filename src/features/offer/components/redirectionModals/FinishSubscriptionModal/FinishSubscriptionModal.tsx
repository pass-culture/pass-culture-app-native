import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { AppBottomSheetModal } from 'ui/components/modals/AppBottomSheetModal'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Typo } from 'ui/theme'

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
  const title = 'Débloque ton crédit pour réserver cette offre'
  const TextComponent: React.FC = () => {
    return (
      <StyledBody>
        Finalise ton inscription pour obtenir ton crédit de
        <Typo.ButtonText> 30€ </Typo.ButtonText>
        et réserver cette offre.
      </StyledBody>
    )
  }
  const CTAComponent: React.FC = () => {
    return (
      <ButtonPrimary
        wording="Terminer mon inscription"
        accessibilityLabel="Aller vers la section profil"
        onPress={navigateToProfile}
        mediumWidth
      />
    )
  }

  return (
    <AppBottomSheetModal
      visible={visible}
      title={title}
      Illustration={BicolorIdCardWithMagnifyingGlass}
      TextComponent={TextComponent}
      CTAComponent={CTAComponent}
      hideModal={hideModal}
    />
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
