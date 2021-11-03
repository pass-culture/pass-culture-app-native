import React from 'react'

import { render } from 'tests/utils'
import { LayoutExpiredLink } from 'ui/components/LayoutExpiredLink'

const changeEmailExpiredLink = jest.fn()
const isFetching = false
const url = 'https://aide.passculture.app/fr/'

describe('<LayoutExpiredLink/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <LayoutExpiredLink resetQuery={changeEmailExpiredLink} isFetching={isFetching} urlFAQ={url} />
    )
    expect(renderAPI).toMatchSnapshot()
  })
})
