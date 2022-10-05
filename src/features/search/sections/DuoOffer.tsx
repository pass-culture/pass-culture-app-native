import React, { useCallback } from 'react'

import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'

export const DuoOffer: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.Duo)

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_OFFER_DUO' })
    logUseFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FilterSwitchWithLabel
      label={SectionTitle.Duo}
      isActive={searchState.offerIsDuo}
      toggle={toggle}
    />
  )
}
