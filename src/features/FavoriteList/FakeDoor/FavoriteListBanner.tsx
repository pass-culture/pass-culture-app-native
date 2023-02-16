import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { FavoriteListSurveyModal } from 'features/FavoriteList/FakeDoor/FavoriteListSurveyModal'
import { analytics } from 'libs/firebase/analytics'
import { useModal } from 'ui/components/modals/useModal'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { BicolorListFav } from 'ui/svg/icons/BicolorListFav'
import { getSpacing, Typo } from 'ui/theme'

export const FavoriteListBanner: FunctionComponent = () => {
  const {
    visible: fakeDoorListFavoritesVisible,
    showModal: showFakeDoorListFavoritesVisible,
    hideModal: hideFakeDoorListFavoritesVisible,
  } = useModal(false)

  useEffect(() => {
    analytics.logFavoriteListDisplayed('favorites')
  }, [])

  return (
    <React.Fragment>
      <StyledTouchableWrapper onPress={showFakeDoorListFavoritesVisible}>
        <StyledBanner dense LeftIcon={BicolorListFav}>
          <Typo.ButtonText>Crée une liste de favoris</Typo.ButtonText>
          <Typo.Body>Trie tes favoris à ta façon et partage-les&nbsp;!</Typo.Body>
        </StyledBanner>
      </StyledTouchableWrapper>
      <FavoriteListSurveyModal
        visible={fakeDoorListFavoritesVisible}
        hideModal={hideFakeDoorListFavoritesVisible}
      />
    </React.Fragment>
  )
}

const StyledBanner = styled(GenericBanner)<{ dense?: boolean }>(({ dense }) => ({
  marginVertical: getSpacing(4),
  paddingVertical: getSpacing(dense ? 4 : 6),
}))

const StyledTouchableWrapper = styled(TouchableOpacity)({
  marginHorizontal: getSpacing(6),
})
