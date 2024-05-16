import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { storage } from 'libs/storage'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const SHARE_APP_MODAL_STORAGE_KEY = 'has_seen_share_app_modal'

export const CulturalSurveyThanks: React.FC = () => {
  const { reset } = useNavigation<UseNavigationType>()
  const { showShareAppModal } = useShareAppContext()

  const navigateToHomeAndShowShareAppModal = async () => {
    reset({
      index: 0,
      routes: [{ name: navigateToHomeConfig.screen }],
    })
    const hasSeenShareAppModal = await storage.readObject(SHARE_APP_MODAL_STORAGE_KEY)
    if (hasSeenShareAppModal) return
    showShareAppModal(ShareAppModalType.BENEFICIARY)
    await storage.saveObject(SHARE_APP_MODAL_STORAGE_KEY, true)
  }

  return (
    <GenericInfoPageWhite
      mobileBottomFlex={0.1}
      animation={QpiThanks}
      title="Un grand merci"
      subtitle="pour tes réponses&nbsp;!">
      <StyledBody>Tu peux dès maintenant découvrir l’étendue du catalogue pass Culture.</StyledBody>
      <Spacer.Flex flex={2} />
      <ButtonContainer>
        <ButtonPrimary
          wording="Découvrir le catalogue"
          onPress={navigateToHomeAndShowShareAppModal}
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
