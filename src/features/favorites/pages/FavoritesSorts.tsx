import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { FavoriteSortBy } from 'features/favorites/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/firebase/analytics'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { Li } from 'ui/components/Li'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { VerticalUl } from 'ui/components/Ul'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const SORT_OPTIONS: Record<FavoriteSortBy, string> = {
  RECENTLY_ADDED: 'Ajouté récemment',
  ASCENDING_PRICE: 'Prix croissant',
  AROUND_ME: 'Proximité géographique',
}
const SORT_OPTIONS_LIST = Object.entries(SORT_OPTIONS) as Array<[FavoriteSortBy, string]>

export const FavoritesSorts: React.FC = () => {
  const { goBack } = useGoBack(...getTabNavConfig('Favorites'))
  const {
    position,
    positionError,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useGeolocation()
  const { sortBy: selectedSortBy, dispatch } = useFavoritesState()
  const [stagedSelectedSortBy, setStagedSelectedSortBy] = useState(selectedSortBy)
  const titleID = uuidv4()

  async function onSortBySelection(sortBy: FavoriteSortBy) {
    function updateSortBySelection() {
      setStagedSelectedSortBy(sortBy)
    }
    if (sortBy === 'AROUND_ME') {
      if (!position && permissionState === GeolocPermissionState.GRANTED) {
        return
      }
      if (position) {
        return updateSortBySelection()
      }
      if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
        return showGeolocPermissionModal()
      }
      return await requestGeolocPermission({ onAcceptance: updateSortBySelection })
    }
    return updateSortBySelection()
  }

  function onValidation() {
    analytics.logHasAppliedFavoritesSorting({ sortBy: stagedSelectedSortBy })
    dispatch({ type: 'SET_SORT_BY', payload: stagedSelectedSortBy })
    goBack()
  }

  return (
    <Container>
      <PageHeader title="Trier" background="primary" withGoBackButton />
      <StyledScrollView>
        <Spacer.Column numberOfSpaces={4} />

        <TitleContainer>
          <Spacer.Column numberOfSpaces={12} />
          <Typo.Title4 nativeID={titleID} {...getHeadingAttrs(2)}>
            Trier par
          </Typo.Title4>
        </TitleContainer>

        <View accessibilityRole={AccessibilityRole.RADIOGROUP} aria-labelledby={titleID}>
          <VerticalUl>
            {SORT_OPTIONS_LIST.map(([sortBy, label]) => {
              return (
                <Li key={sortBy}>
                  <RadioButton
                    label={label}
                    isSelected={stagedSelectedSortBy === sortBy}
                    onSelect={() => onSortBySelection(sortBy)}
                    accessibilityLabel={`Trier par ${label}`}
                    marginVertical={getSpacing(3)}
                    testID={sortBy}
                  />
                  <InputError
                    visible={!!(sortBy === 'AROUND_ME' && positionError)}
                    messageId={positionError?.message}
                    numberOfSpacesTop={1}
                  />
                </Li>
              )
            })}
          </VerticalUl>
        </View>
      </StyledScrollView>

      <ButtonContainer>
        <ButtonPrimary wording="Valider" onPress={onValidation} center />
      </ButtonContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledScrollView = styled(ScrollView)({
  flexGrow: 1,
  paddingLeft: getSpacing(8),
  paddingRight: getSpacing(5),
})

const TitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const ButtonContainer = styled.View({
  padding: getSpacing(5),
})
