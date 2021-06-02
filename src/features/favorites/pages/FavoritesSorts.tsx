import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Linking, ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { analytics } from 'libs/analytics'
import { MonitoringError } from 'libs/errorMonitoring'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { useModal } from 'ui/components/modals/useModal'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export type FavoriteSortBy = 'RECENTLY_ADDED' | 'ASCENDING_PRICE' | 'AROUND_ME'
const SORT_OPTIONS: Record<FavoriteSortBy, string> = {
  RECENTLY_ADDED: t`Ajouté récemment`,
  ASCENDING_PRICE: t`Prix croissant`,
  AROUND_ME: t`Proximité géographique`,
}
const SORT_OPTIONS_LIST = Object.entries(SORT_OPTIONS) as Array<[FavoriteSortBy, string]>

export const FavoritesSorts: React.FC = () => {
  const { goBack } = useNavigation()
  const {
    position,
    isPositionUnavailable,
    permissionState,
    requestGeolocPermission,
  } = useGeolocation()
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
      if (position) {
        return void updateSortBySelection()
      }
      if (!position && permissionState === GeolocPermissionState.GRANTED) {
        new MonitoringError('Position is unavailable', 'NoPositionFavoritesSorts')
        return
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
          <Typo.Title4>{t`Trier par`}</Typo.Title4>
        </TitleContainer>

        {SORT_OPTIONS_LIST.map(([sortBy, label]) => {
          const isSelected = stagedSelectedSortBy === sortBy
          const textColor = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK
          return (
            <React.Fragment key={sortBy}>
              <LabelContainer
                key={sortBy}
                onPress={() => onSortBySelection(sortBy)}
                testID={sortBy}>
                <Spacer.Column numberOfSpaces={8} />
                <Spacer.Row numberOfSpaces={6} />
                <Typo.ButtonText numberOfLines={2} color={textColor}>
                  {label}
                </Typo.ButtonText>
                <Spacer.Flex />
                {!!isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(8)} />}
              </LabelContainer>
              {!!(sortBy === 'AROUND_ME' && isPositionUnavailable) && (
                <InputError
                  visible
                  messageId={t`La géolocalisation est temporairement inutilisable sur ton téléphone`}
                  numberOfSpacesTop={1}
                />
              )}
            </React.Fragment>
          )
        })}
      </ScrollView>

      <PageHeader title={t`Trier`} />
      <ButtonContainer>
        <ButtonPrimary title={t`Valider`} onPress={onValidation} />
      </ButtonContainer>
      <GeolocationActivationModal
        isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        onPressGeolocPermissionModalButton={onPressCustomGeolocPermissionModalButton}
      />
    </React.Fragment>
  )
}

const contentContainerStyle: ViewStyle = {
  flexGrow: 1,
  paddingLeft: getSpacing(2),
  paddingRight: getSpacing(6),
}

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
