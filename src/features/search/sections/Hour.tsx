import { t } from '@lingui/macro'
import React, { useCallback } from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'

export const Hour: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.Hour)

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_HOUR' })
    logUseFilter()
  }, [])

  return (
    <SectionWithSwitch
      title={SectionTitle.Hour}
      subtitle={t`Seules les sorties seront affichées`}
      accessibilityLabel={t`Interrupteur filtre heures`}
      active={!!searchState.timeRange}
      toggle={toggle}
    />
  )
}
