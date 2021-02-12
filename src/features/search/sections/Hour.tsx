import { t } from '@lingui/macro'
import React, { useCallback } from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { _ } from 'libs/i18n'

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
      subtitle={_(t`Seules les sorties seront affichées`)}
      active={!!searchState.timeRange}
      toggle={toggle}
    />
  )
}
