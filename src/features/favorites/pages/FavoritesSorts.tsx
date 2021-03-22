import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React from 'react'
import { Linking, ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { IGeolocationContext } from 'libs/geolocation/GeolocationWrapper'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const DEBOUNCED_CALLBACK_MS = 200

interface Options extends IGeolocationContext {
  showGeolocPermissionModal: () => void
}

export const useSelectSort = ({
  showGeolocPermissionModal,
  position,
  permissionState,
  requestGeolocPermission,
}: Options) => {
  const { sortBy: stateSort, dispatch } = useFavoritesState()
  return {
    isFilterSelected: (sortBy: string) => {
      return stateSort === sortBy
    },
    selectFilter: (sortBy: keyof typeof SORT_OPTIONS) => {
      return () => dispatch({ type: 'SET_FILTER', payload: sortBy })
    },
    onPressAroundMe: async () => {
      if (position === null) {
        const shouldDisplayCustomGeolocRequest =
          permissionState === GeolocPermissionState.NEVER_ASK_AGAIN
        if (shouldDisplayCustomGeolocRequest) {
          showGeolocPermissionModal()
        } else {
          await requestGeolocPermission()
        }
      }
    },
  }
}

export const SORT_OPTIONS = {
  RECENTLY_ADDED: {
    label: _(t`Ajouté récemment`),
  },
  ASCENDING_PRICE: {
    label: _(t`Prix croissant`),
  },
  AROUND_ME: {
    label: _(t`Proximité géographique`),
  },
}

export const FavoritesSorts: React.FC = () => {
  const { goBack } = useNavigation()

  const { position, permissionState, requestGeolocPermission } = useGeolocation()
  const {
    visible: isGeolocPermissionModalVisible,
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
  } = useModal(false)
  const { isFilterSelected, selectFilter, onPressAroundMe } = useSelectSort({
    showGeolocPermissionModal,
    position,
    permissionState,
    requestGeolocPermission,
  } as Options)
  const debouncedCallback = React.useRef(debounce(goBack, DEBOUNCED_CALLBACK_MS)).current

  const onPressGeolocPermissionModalButton = () => {
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
        {Object.entries(SORT_OPTIONS)
          .map(([f, { label }]) => {
            const sortBy = f as keyof typeof SORT_OPTIONS
            const isSelected = isFilterSelected(sortBy)
            const textColor = isSelected ? ColorsEnum.PRIMARY : ColorsEnum.BLACK
            return (
              <LabelContainer
                key={sortBy}
                onPress={
                  sortBy === 'AROUND_ME' && permissionState !== GeolocPermissionState.GRANTED
                    ? onPressAroundMe
                    : selectFilter(sortBy)
                }
                testID={sortBy}>
                <Spacer.Column numberOfSpaces={8} />
                <Spacer.Row numberOfSpaces={6} />
                <Typo.ButtonText numberOfLines={2} color={textColor}>
                  {label}
                </Typo.ButtonText>
                <Spacer.Flex />
                {isSelected && <Validate color={ColorsEnum.PRIMARY} size={getSpacing(8)} />}
              </LabelContainer>
            )
          })
          .filter((f) => !!f)}
      </ScrollView>

      <PageHeader title={_(t`Trier`)} />
      <ButtonContainer>
        <ButtonPrimary title={_(t`Valider`)} onPress={debouncedCallback} />
      </ButtonContainer>
      <GeolocationActivationModal
        isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
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
