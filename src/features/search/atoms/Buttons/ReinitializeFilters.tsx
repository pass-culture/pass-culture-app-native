import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { initialSearchState } from 'features/search/pages/reducer'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Typo } from 'ui/theme'

export const ReinitializeFilters = () => {
  const { dispatch: dispatchSearch } = useSearch()
  const { dispatch: dispatchStagedSearch } = useStagedSearch()
  const logReinitializeFilters = useFunctionOnce(() => {
    analytics.logReinitializeFilters()
  })
  const maxPrice = useMaxPrice()
  const reinitializeFilters = () => {
    dispatchStagedSearch({ type: 'INIT' })
    dispatchStagedSearch({
      type: 'SET_STATE',
      payload: {
        priceRange: [0, maxPrice],
      },
    })
    dispatchSearch({
      type: 'SET_STATE',
      payload: {
        locationFilter: initialSearchState.locationFilter,
        offerCategories: initialSearchState.offerCategories,
      },
    })
    logReinitializeFilters()
  }

  return (
    <StyledTouchable
      onPress={reinitializeFilters}
      {...accessibilityAndTestId(t`Réinitialiser les filtres`)}
      type="reset">
      <ButtonText>{t`Réinitialiser`}</ButtonText>
    </StyledTouchable>
  )
}

const ButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledTouchable = styledButton(Touchable).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))``
