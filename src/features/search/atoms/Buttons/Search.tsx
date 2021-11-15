import { t } from '@lingui/macro'
import React from 'react'

import { useCommitStagedSearch } from 'features/search/pages/SearchWrapper'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'

const SEARCH_CTA_WORDING = t`Rechercher`

export const Search: React.FC = () => {
  const { commitStagedSearch } = useCommitStagedSearch()

  function onPress() {
    commitStagedSearch()
  }

  return (
    <ButtonWithLinearGradient wording={SEARCH_CTA_WORDING} onPress={onPress} isDisabled={false} />
  )
}
