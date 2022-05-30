import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchHeader } from 'features/search/components/SearchHeader'
import { render } from 'tests/utils'

describe('SearchHeader component', () => {
  const searchInputID = uuidv4()

  it('should render SearchHeader', () => {
    expect(render(<SearchHeader searchInputID={searchInputID} />)).toMatchSnapshot()
  })
})
