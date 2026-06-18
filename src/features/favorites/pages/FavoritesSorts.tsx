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
import { useLocation } from 'libs/location/location'
import { requestGeolocPermission } from 'libs/locationV2/requestGeolocPermission'
import { Button } from 'ui/designSystem/Button/Button'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

const sortOptions = buildSortRadioOptions()

export const FavoritesSorts: React.FC = () => {
  const { goBack } = useGoBack(...getTabHookConfig('Favorites'))
  const { geolocPositionError } = useLocation()
  const { sortBy: selectedSortBy, dispatch } = useFavoritesState()
  const [stagedSelectedSortBy, setStagedSelectedSortBy] = useState(selectedSortBy)

  const currentLabel = getLabelFromSortBy(stagedSelectedSortBy)
  const hasGeolocError = !!geolocPositionError

  const onSortBySelection = async (sortBy: FavoriteSortBy) => {
    if (sortBy === 'AROUND_ME') {
      return requestGeolocPermission({ onSuccess: () => setStagedSelectedSortBy(sortBy) })
    }
    return setStagedSelectedSortBy(sortBy)
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
    <PageWithHeader
      title="Trier"
      onGoBack={goBack}
      scrollChildren={
        <React.Fragment>
          <RadioButtonGroup
            label="Trier par"
            labelVariant="title2"
            options={sortOptions}
            value={currentLabel}
            onChange={handleSortChange}
            error={hasGeolocError}
            errorText={geolocPositionError?.message ?? ''}
          />
          <ButtonContainer>
            <Button wording="Valider" onPress={onValidation} />
          </ButtonContainer>
        </React.Fragment>
      }
    />
  )
}

const ButtonContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xl,
}))
