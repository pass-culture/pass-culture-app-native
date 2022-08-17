import React from 'react'

import { CookiesConsentHome } from 'features/cookies/pages/CookiesConsentHome'
import { render } from 'tests/utils'

const hideModal = jest.fn()

describe('<CookiesConsentHome/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(<CookiesConsentHome visible={true} hideModal={hideModal} />)
    expect(renderAPI).toMatchSnapshot()
  })
})
