import React, { memo } from 'react'
import styled from 'styled-components/native'

import { MapBlock } from 'features/home/components/modules/categories/map/MapBlock'
import { CategoriesButtons } from 'features/search/components/CategoriesButtons/CategoriesButtons'
import { SearchResults } from 'features/search/components/SearchResults/SearchResults'
import { useShowResultsForCategory } from 'features/search/helpers/useShowResultsForCategory/useShowResultsForCategory'
import { SearchView } from 'features/search/types'
import { useLocation } from 'libs/location'
import { useVenues } from 'libs/place'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type BodySearchProps = {
  view?: SearchView
}

export const BodySearch = memo(function BodySearch({ view }: BodySearchProps) {
  const showResultsForCategory = useShowResultsForCategory()
  const { userLocation } = useLocation()
  const { data: venues } = useVenues('')
  console.log({ venues })
  if (view === SearchView.Results) {
    return <SearchResults />
  }
  return (
    <Container>
      {!!userLocation && (
        <React.Fragment>
          <CategoriesTitle />
          <MapBlock />
        </React.Fragment>
      )}
      <CategoriesButtons onPressCategory={showResultsForCategory} />
      <Spacer.TabBar />
    </Container>
  )
})

const Container = styled.View({
  flex: 1,
  overflowY: 'auto',
})

// const StyledButtonPrimary = styled(ButtonPrimary)({
//   marginHorizontal: getSpacing(6),
//   width: 'auto',
// })

const CategoriesTitle = styled(Typo.Title3).attrs({
  children: 'Explore les lieux',
  ...getHeadingAttrs(2),
})({
  marginTop: getSpacing(8),
  marginHorizontal: getSpacing(5),
  paddingHorizontal: getSpacing(1),
  paddingBottom: getSpacing(4),
})
