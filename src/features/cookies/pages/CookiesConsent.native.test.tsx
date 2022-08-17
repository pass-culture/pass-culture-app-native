import React from 'react'

import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { render } from 'tests/utils'

const hideModal = jest.fn()

describe('<CookiesConsent/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(<CookiesConsent visible={true} hideModal={hideModal} />)
    expect(renderAPI).toMatchSnapshot()
  })
})
