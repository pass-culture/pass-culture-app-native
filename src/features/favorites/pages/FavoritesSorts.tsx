import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { Validate as ValidateDefault } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export type FavoriteSortBy = 'RECENTLY_ADDED' | 'ASCENDING_PRICE' | 'AROUND_ME'

const SORT_OPTIONS: Record<FavoriteSortBy, string> = {
  RECENTLY_ADDED: t`Ajouté récemment`,
  ASCENDING_PRICE: t`Prix croissant`,
  AROUND_ME: t`Proximité géographique`,
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

  async function onSortBySelection(sortBy: FavoriteSortBy) {
    function updateSortBySelection() {
      setStagedSelectedSortBy(sortBy)
    }
    if (sortBy === 'AROUND_ME') {
      if (!position && permissionState === GeolocPermissionState.GRANTED) {
        return
      }
      if (position) {
        return void updateSortBySelection()
      }
      if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
        return void showGeolocPermissionModal()
      }
      return void (await requestGeolocPermission({
        onAcceptance: updateSortBySelection,
      }))
    }
    return void updateSortBySelection()
  }

  function onValidation() {
    analytics.logHasAppliedFavoritesSorting({ sortBy: stagedSelectedSortBy })
    dispatch({ type: 'SET_SORT_BY', payload: stagedSelectedSortBy })
    goBack()
  }

  return (
    <Container>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={16} />

        <TitleContainer>
          <Spacer.Column numberOfSpaces={12} />
          <Spacer.Row numberOfSpaces={6} />
          <Typo.Title4>{t`Trier par`}</Typo.Title4>
        </TitleContainer>

        {SORT_OPTIONS_LIST.map(([sortBy, label]) => {
          const isSelected = stagedSelectedSortBy === sortBy
          return (
            <React.Fragment key={sortBy}>
              <LabelContainer
                key={sortBy}
                onPress={() => onSortBySelection(sortBy)}
                testID={sortBy}>
                <Spacer.Column numberOfSpaces={8} />
                <Spacer.Row numberOfSpaces={6} />
                <ButtonText numberOfLines={2} isSelected={isSelected}>
                  {label}
                </ButtonText>
                <Spacer.Flex />
                {!!isSelected && <Validate />}
              </LabelContainer>
              {sortBy === 'AROUND_ME' && positionError ? (
                <InputError visible messageId={positionError.message} numberOfSpacesTop={1} />
              ) : null}
            </React.Fragment>
          )
        })}
      </ScrollView>

      <PageHeader title={t`Trier`} />
      <ButtonContainer>
        <StyledButtonPrimary wording={t`Valider`} onPress={onValidation} />
      </ButtonContainer>
    </Container>
  )
}

const ButtonText = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const Validate = styled(ValidateDefault).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icon.smSize,
}))``

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const contentContainerStyle: ViewStyle = {
  flexGrow: 1,
  paddingLeft: getSpacing(2),
  paddingRight: getSpacing(3),
}

const LabelContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: getSpacing(4),
})

const TitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: getSpacing(4),
})

const ButtonContainer = styled.View({
  padding: getSpacing(5),
})

const StyledButtonPrimary = styled(ButtonPrimary)({
  alignSelf: 'center',
})
