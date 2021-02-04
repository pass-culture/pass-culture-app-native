import { t } from '@lingui/macro'
import React from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { _ } from 'libs/i18n'

export const Hour: React.FC = () => {
  const { searchState, dispatch } = useSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.Hour)

  const toggle = () => {
    dispatch({ type: 'TOGGLE_HOUR' })
    logUseFilter()
  }

  return (
    <SectionWithSwitch
      title={SectionTitle.Hour}
      subtitle={_(t`Seules les Sorties seront affichées`)}
      active={!!searchState.timeRange}
      toggle={toggle}
    />
  )
}
