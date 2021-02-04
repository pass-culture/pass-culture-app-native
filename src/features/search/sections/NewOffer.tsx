import React from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'

export const NewOffer: React.FC = () => {
  const { searchState, dispatch } = useSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.New)

  const toggle = () => {
    dispatch({ type: 'TOGGLE_OFFER_NEW' })
    logUseFilter()
  }

  return (
    <SectionWithSwitch title={SectionTitle.New} active={searchState.offerIsNew} toggle={toggle} />
  )
}
