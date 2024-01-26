import React, { memo } from 'react'
import styled from 'styled-components/native'

import { CategoriesButtons } from 'features/search/components/CategoriesButtons/CategoriesButtons'
import { SearchResultsContent } from 'features/search/components/SearchResultsContent/SearchResultsContent'
import { useShowResultsForCategory } from 'features/search/helpers/useShowResultsForCategory/useShowResultsForCategory'
import { SearchView } from 'features/search/types'
import { Spacer } from 'ui/components/spacer/Spacer'

type BodySearchProps = {
  view?: SearchView
}

export const BodySearch = memo(function BodySearch({ view }: BodySearchProps) {
  const showResultsForCategory = useShowResultsForCategory()

  if (view === SearchView.Results) {
    return <SearchResultsContent />
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
