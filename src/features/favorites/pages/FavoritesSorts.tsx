import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Linking, ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { _ } from 'libs/i18n'
import { storage } from 'libs/storage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export type FavoriteSortBy = 'RECENTLY_ADDED' | 'ASCENDING_PRICE' | 'AROUND_ME'
const SORT_OPTIONS: Record<FavoriteSortBy, string> = {
  RECENTLY_ADDED: _(t`Ajouté récemment`),
  ASCENDING_PRICE: _(t`Prix croissant`),
  AROUND_ME: _(t`Proximité géographique`),
}
const SORT_OPTIONS_LIST = Object.entries(SORT_OPTIONS) as Array<[FavoriteSortBy, string]>

export const FavoritesSorts: React.FC = () => {
  const { goBack } = useNavigation()
  const { permissionState, requestGeolocPermission } = useGeolocation()
  const { sortBy: selectedSortBy, dispatch } = useFavoritesState()
  const [stagedSelectedSortBy, setStagedSelectedSortBy] = useState(selectedSortBy)
  const {
    visible: isGeolocPermissionModalVisible,
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
  } = useModal(false)

  async function onSortBySelection(sortBy: FavoriteSortBy) {
    function updateSortBySelection() {
      setStagedSelectedSortBy(sortBy)
    }
    if (sortBy === 'AROUND_ME') {
      const hasAllowedGeolocation = await storage.readObject('has_allowed_geolocation')
      const shouldAskGeolocPermission =
        permissionState !== GeolocPermissionState.GRANTED ||
        hasAllowedGeolocation === false ||
        hasAllowedGeolocation === null
      if (shouldAskGeolocPermission) {
        const shouldDisplayCustomGeolocRequest =
          permissionState === GeolocPermissionState.NEVER_ASK_AGAIN
        if (shouldDisplayCustomGeolocRequest) {
          return void showGeolocPermissionModal()
        }
        return void (await requestGeolocPermission({
          onAcceptance: updateSortBySelection,
        }))
      }
      return void updateSortBySelection()
    }
    return void updateSortBySelection()
  }

  function onValidation() {
    analytics.logHasAppliedFavoritesSorting({ sortBy: stagedSelectedSortBy })
    dispatch({ type: 'SET_SORT_BY', payload: stagedSelectedSortBy })
    goBack()
  }

  function onPressCustomGeolocPermissionModalButton() {
    Linking.openSettings()
    hideGeolocPermissionModal()
  }

  return (
    <React.Fragment>
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={16} />

        <TitleContainer>
          <Spacer.Column numberOfSpaces={12} />
          <Spacer.Row numberOfSpaces={6} />
          <Typo.Title4>{_(t`Trier par`)}</Typo.Title4>
        </TitleContainer>

        {SORT_OPTIONS_LIST.map(([sortBy, label]) => {
          const isSelected = stagedSelectedSortBy === sortBy
          const textColor = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK
          return (
            <LabelContainer key={sortBy} onPress={() => onSortBySelection(sortBy)} testID={sortBy}>
              <Spacer.Column numberOfSpaces={8} />
              <Spacer.Row numberOfSpaces={6} />
              <Typo.ButtonText numberOfLines={2} color={textColor}>
                {label}
              </Typo.ButtonText>
              <Spacer.Flex />
              {isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(8)} />}
            </LabelContainer>
          )
        })}
      </ScrollView>

      <PageHeader title={_(t`Trier`)} />
      <ButtonContainer>
        <ButtonPrimary title={_(t`Valider`)} onPress={onValidation} />
      </ButtonContainer>
      <GeolocationActivationModal
        isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        onPressGeolocPermissionModalButton={onPressCustomGeolocPermissionModalButton}
      />
    </React.Fragment>
  )
}

const contentContainerStyle: ViewStyle = { flexGrow: 1, marginRight: getSpacing(6) }

const LabelContainer = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({
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
