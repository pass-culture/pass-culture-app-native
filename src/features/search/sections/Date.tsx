import { t } from '@lingui/macro'
import React, { useCallback } from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'
import { _ } from 'libs/i18n'

export const Date: React.FC = () => {
  const { searchState, dispatch } = useSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.Date)

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_DATE' })
    logUseFilter()
  }, [])

  return (
    <SectionWithSwitch
      title={SectionTitle.Date}
      subtitle={_(t`Seules les sorties seront affichées`)}
      active={!!searchState.date}
      toggle={toggle}
    />
  )
}
