import React, { useCallback } from 'react'

import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'

export const NewOffer: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.New)

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_OFFER_NEW' })
    logUseFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FilterSwitchWithLabel
      label={SectionTitle.New}
      isActive={searchState.offerIsNew}
      toggle={toggle}
    />
  )
}
