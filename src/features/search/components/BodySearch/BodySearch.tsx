import React, { memo } from 'react'
import styled from 'styled-components/native'

import { CategoriesButtons } from 'features/search/components/CategoriesButtons/CategoriesButtons'
import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete/SearchAutocomplete'
import { SearchResults } from 'features/search/components/SearchResults/SearchResults'
import { useShowResultsForCategory } from 'features/search/helpers/useShowResultsForCategory/useShowResultsForCategory'
import { Hit } from 'features/search/pages/Search/Search'
import { SearchView } from 'features/search/types'
import { Spacer } from 'ui/components/spacer/Spacer'

type BodySearchProps = {
  view?: SearchView
}

export const BodySearch = memo(function BodySearch({ view }: BodySearchProps) {
  const showResultsForCategory = useShowResultsForCategory()

  if (view === SearchView.Suggestions) {
    return (
      <React.Fragment>
        <SearchAutocomplete hitComponent={Hit} />
      </React.Fragment>
    )
  } else if (view === SearchView.Results) {
    return <SearchResults />
  }
  return (
    <Container>
      <CategoriesButtons onPressCategory={showResultsForCategory} />
      <Spacer.TabBar />
    </Container>
  )
})

const Container = styled.View({
  flex: 1,
  overflowY: 'auto',
})
