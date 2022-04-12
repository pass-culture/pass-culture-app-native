import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { InputError } from 'ui/components/inputs/InputError'
import { RadioButton } from 'ui/components/radioButtons/RadioButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'
import { Li } from 'ui/web/list/Li'
import { VerticalUl } from 'ui/web/list/Ul'

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
      <PageHeader title={t`Trier`} />
      <StyledScrollView>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={16} />

        <TitleContainer>
          <Spacer.Column numberOfSpaces={12} />
          <Typo.Title4 {...getHeadingAttrs(2)}>{t`Trier par`}</Typo.Title4>
        </TitleContainer>

        <VerticalUl>
          {SORT_OPTIONS_LIST.map(([sortBy, label]) => {
            return (
              <Li key={sortBy}>
                <RadioButton
                  label={label}
                  isSelected={stagedSelectedSortBy === sortBy}
                  onSelect={() => onSortBySelection(sortBy)}
                  accessibilityLabel={t`Trier par` + ` ${label}`}
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
      </StyledScrollView>

      <ButtonContainer>
        <ButtonPrimary wording={t`Valider`} onPress={onValidation} center />
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
