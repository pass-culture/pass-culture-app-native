import React from 'react'

import { useDebouncedScrolling } from 'features/search/atoms'
import { InfiniteHits } from 'features/search/components'

export const SearchResults: React.FC = () => {
  const { isScrolling, handleIsScrolling } = useDebouncedScrolling()

  return (
    <React.Fragment>
      <InfiniteHits handleIsScrolling={handleIsScrolling} isScrolling={isScrolling} />
    </React.Fragment>
  )
}
