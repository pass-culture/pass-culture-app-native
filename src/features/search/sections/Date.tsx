import React, { useCallback } from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'

export const Date: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.Date)

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_DATE' })
    logUseFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SectionWithSwitch
      title={SectionTitle.Date}
      subtitle="Seules les sorties seront affichées"
      active={!!searchState.date}
      toggle={toggle}
    />
  )
}
