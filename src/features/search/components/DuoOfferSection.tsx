import { t } from '@lingui/macro'
import React from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'

export const DuoOfferSection: React.FC = () => {
  const { searchState, dispatch } = useSearch()

  const toggle = () => {
    dispatch({ type: 'TOGGLE_OFFER_DUO' })
  }

  return (
    <SectionWithSwitch
      title={_(t`Uniquement les offres duo`)}
      active={searchState.offerIsDuo}
      toggle={toggle}
    />
  )
}
