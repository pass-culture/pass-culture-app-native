import { t } from '@lingui/macro'
import React from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'

export const NewOfferSection: React.FC = () => {
  const { searchState, dispatch } = useSearch()

  const toggle = () => {
    dispatch({ type: 'TOGGLE_OFFER_NEW' })
  }

  return (
    <SectionWithSwitch
      title={_(t`Uniquement les nouveautés`)}
      active={searchState.offerIsNew}
      toggle={toggle}
    />
  )
}
