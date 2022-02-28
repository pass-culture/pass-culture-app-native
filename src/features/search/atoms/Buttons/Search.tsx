import { t } from '@lingui/macro'
import React from 'react'

import { useCommit, useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'

const SEARCH_CTA_WORDING = t`Rechercher`

export const Search: React.FC = () => {
  const { commit } = useCommit()
  const { dispatch } = useSearch()
  const { dispatch: stagedDispatch } = useStagedSearch()

  const onPress = () => {
    commit()
    dispatch({ type: 'SHOW_RESULTS', payload: true })
    stagedDispatch({ type: 'SHOW_RESULTS', payload: true })
  }

  return <ButtonWithLinearGradient wording={SEARCH_CTA_WORDING} onPress={onPress} type="submit" />
}
