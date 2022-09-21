import React from 'react'

import { BannedCountryError } from 'features/errors/pages/BannedCountryError'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

describe('BannedCountryError', () => {
  it('should render correctly', () => {
    const renderAPI = render(<BannedCountryError />, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    expect(renderAPI).toMatchSnapshot()
  })
})
