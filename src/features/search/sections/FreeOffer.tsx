import { t } from '@lingui/macro'
import React, { useCallback } from 'react'

import { SectionWithSwitch } from 'features/search/components/SectionWithSwitch'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SectionTitle } from 'features/search/sections/titles'
import { useLogFilterOnce } from 'features/search/utils/useLogFilterOnce'

export const FreeOffer: React.FC = () => {
  const { searchState, dispatch } = useStagedSearch()
  const logUseFilter = useLogFilterOnce(SectionTitle.Free)

  const toggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_OFFER_FREE' })
    logUseFilter()
  }, [])

  return (
    <SectionWithSwitch
      active={searchState.offerIsFree}
      testID={t`Interrupteur filtre sorties avec date`}
      title={SectionTitle.Free}
      toggle={toggle}
    />
  )
}
