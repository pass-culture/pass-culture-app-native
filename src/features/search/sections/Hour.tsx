import { t } from '@lingui/macro'
import React from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'

export const Hour: React.FC = () => {
  const { searchState, dispatch } = useSearch()

  const toggle = () => {
    dispatch({ type: 'TOGGLE_HOUR' })
  }

  return (
    <SectionWithSwitch
      title={_(t`Heure`)}
      subtitle={_(t`Seules les offres Sorties seront affichées`)}
      active={!!searchState.timeRange}
      toggle={toggle}
    />
  )
}
