import React, { useState } from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { BicolorTables } from 'ui/svg/icons/BicolorTables'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { PlusLight } from 'ui/svg/icons/PlusLight'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  visible: boolean
  hideModal: () => void
  showSurveyModal: () => void
}

export const FavoriteListOfferModal: React.FC<Props> = ({
  visible,
  hideModal,
  showSurveyModal,
}) => {
  const [shouldSeeSurvey, setShouldSeeSurvey] = useState(false)
  const onCreateFavListPress = () => {
    setShouldSeeSurvey(true)
    hideModal()
  }
  const onHideModalPress = () => {
    setShouldSeeSurvey(false)
    hideModal()
  }
  return (
    <React.Fragment>
      <AppModalWithIllustration
        Illustration={StyledBicolorTables}
        title="Crée une liste de favoris&nbsp;!"
        hideModal={onHideModalPress}
        onModalHide={shouldSeeSurvey ? showSurveyModal : undefined}
        visible={visible}>
        <StyledBody>Trie tes favoris à ta façon et partage les avec tes amis</StyledBody>
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary
          wording="Créer une liste de favoris"
          icon={PlusLight}
          onPress={onCreateFavListPress}
        />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryBlack
          wording="Non merci"
          onPress={onHideModalPress}
          icon={Invalidate}
          accessibilityLabel="Fermer la modale"
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
