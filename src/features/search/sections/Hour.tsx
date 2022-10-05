import React, { useCallback } from 'react'

import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'

export const Hour: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.Hour)

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_HOUR' })
    logUseFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FilterSwitchWithLabel
      label={SectionTitle.Hour}
      isActive={!!searchState.timeRange}
      toggle={toggle}
      subtitle="Seules les sorties seront affichées"
    />
  )
}
