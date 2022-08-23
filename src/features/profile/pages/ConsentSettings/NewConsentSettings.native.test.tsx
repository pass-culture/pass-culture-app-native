import React from 'react'

import { NewConsentSettings } from 'features/profile/pages/ConsentSettings/NewConsentSettings'
import { render } from 'tests/utils'

describe('<NewConsentSettings/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(<NewConsentSettings />)
    expect(renderAPI).toMatchSnapshot()
  })
})
