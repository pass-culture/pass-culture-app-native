import { t } from '@lingui/macro'
import React, { useCallback } from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'

export const NewOffer: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.New)

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_OFFER_NEW' })
    logUseFilter()
  }, [])

  return (
    <SectionWithSwitch
      title={SectionTitle.New}
      accessibilityLabel={t`Interrupteur filtre nouvelles offres`}
      active={searchState.offerIsNew}
      toggle={toggle}
    />
  )
}
