import React, { useState } from 'react'
import styled from 'styled-components/native'

import { useFavoritesState } from 'features/favorites/context/FavoritesWrapper'
import {
  buildSortRadioOptions,
  getLabelFromSortBy,
  getSortByFromLabel,
} from 'features/favorites/helpers/sortOptions'
import { FavoriteSortBy } from 'features/favorites/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { GeolocPermissionState, useLocation } from 'libs/location/location'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

const sortOptions = buildSortRadioOptions()

export const FavoritesSorts: React.FC = () => {
  const { goBack } = useGoBack(...getTabHookConfig('Favorites'))
  const {
    geolocPosition,
    geolocPositionError,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useLocation()
  const { sortBy: selectedSortBy, dispatch } = useFavoritesState()
  const [stagedSelectedSortBy, setStagedSelectedSortBy] = useState(selectedSortBy)

  const currentLabel = getLabelFromSortBy(stagedSelectedSortBy)
  const hasGeolocError = !!geolocPositionError

  const onSortBySelection = async (sortBy: FavoriteSortBy) => {
    const updateSortBySelection = () => {
      setStagedSelectedSortBy(sortBy)
    }

    if (sortBy === 'AROUND_ME') {
      if (!geolocPosition && permissionState === GeolocPermissionState.GRANTED) {
        return
      }
      if (geolocPosition) {
        return updateSortBySelection()
      }
      if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
        return showGeolocPermissionModal()
      }
      return requestGeolocPermission({ onAcceptance: updateSortBySelection })
    }
    return updateSortBySelection()
  }

  const handleSortChange = (label: string) => {
    const sortBy = getSortByFromLabel(label)
    if (sortBy) {
      void onSortBySelection(sortBy)
    }
  }

  const onValidation = () => {
    void analytics.logHasAppliedFavoritesSorting({ sortBy: stagedSelectedSortBy })
    dispatch({ type: 'SET_SORT_BY', payload: stagedSelectedSortBy })
    goBack()
  }

  return (
    <SecondaryPageWithBlurHeader title="Trier" onGoBack={goBack}>
      <RadioButtonGroupContainer>
        <RadioButtonGroup
          label="Trier par"
          labelVariant="title3"
          options={sortOptions}
          value={currentLabel}
          onChange={handleSortChange}
          error={hasGeolocError}
          errorText={geolocPositionError?.message ?? ''}
        />
      </RadioButtonGroupContainer>
      <ButtonContainer>
        <ButtonPrimary wording="Valider" onPress={onValidation} center />
      </ButtonContainer>
    </SecondaryPageWithBlurHeader>
  )
}

const RadioButtonGroupContainer = styled.View(({ theme }) => ({
  paddingTop: theme.designSystem.size.spacing.xxxl,
}))

const ButtonContainer = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.xl,
}))
