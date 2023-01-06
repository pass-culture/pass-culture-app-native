import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { BannedCountryError } from './BannedCountryError'

describe('BannedCountryError', () => {
  it('should render correctly', () => {
    const renderAPI = render(<BannedCountryError />, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    expect(renderAPI).toMatchSnapshot()
  })
})
