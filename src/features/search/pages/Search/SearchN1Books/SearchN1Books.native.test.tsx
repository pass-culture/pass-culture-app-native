import React from 'react'

import { SearchN1Books } from 'features/search/pages/Search/SearchN1Books/SearchN1Books'
import { render, screen } from 'tests/utils'

describe('<SearchN1Books/>', () => {
  it('should render SearchN1Books', () => {
    render(<SearchN1Books />)

    expect(screen).toMatchSnapshot()
  })
})
