import React from 'react'
import styled from 'styled-components/native'

import { FavoriteListSurveyModal } from 'features/FavoriteList/FakeDoor/FavoriteListSurveyModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { useModal } from 'ui/components/modals/useModal'
import { BicolorTables } from 'ui/svg/icons/BicolorTables'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { PlusLight } from 'ui/svg/icons/PlusLight'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
}

export const FavoriteListOfferModal: React.FC<Props> = ({ visible, hideModal }) => {
  const {
    visible: isSurveyModalVisible,
    showModal: showSurveyModal,
    hideModal: hideSurveyModal,
  } = useModal()

  const onHideSurveyModalPress = () => {
    hideSurveyModal()
    hideModal()
  }

  return (
    <React.Fragment>
      <AppModalWithIllustration
        Illustration={StyledBicolorTables}
        title="Crée une liste de favoris&nbsp;!"
        hideModal={hideModal}
        visible={visible}>
        <StyledBody>Trie tes favoris à ta façon et partage les avec tes amis</StyledBody>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          wording="Créer une liste de favoris"
          icon={PlusLight}
          onPress={showSurveyModal}
        />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryBlack
          wording="Non merci"
          onPress={hideModal}
          icon={Invalidate}
          accessibilityLabel="Fermer la modale"
        />
        <FavoriteListSurveyModal
          visible={isSurveyModalVisible}
          hideModal={onHideSurveyModalPress}
        />
      </AppModalWithIllustration>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledBicolorTables = styled(BicolorTables).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
