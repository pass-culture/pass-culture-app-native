import React from 'react'

import { CookiesConsentModal } from 'features/cookies/pages/CookiesConsentModal'
import { render } from 'tests/utils'

const hideModal = jest.fn()

describe('<CookiesConsentModal/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(<CookiesConsentModal visible={true} hideModal={hideModal} />)
    expect(renderAPI).toMatchSnapshot()
  })
})
