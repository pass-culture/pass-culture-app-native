import React from 'react'

import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { EighteenBirthday } from './EighteenBirthday'

afterEach(() => {
  storage.clear('has_seen_eligible_card')
})

describe('<EighteenBirthday />', () => {
  it('should render eighteen birthday', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const renderAPI = render(reactQueryProviderHOC(<EighteenBirthday />))
    expect(renderAPI).toMatchSnapshot()
  })

  it('should set `has_seen_eligible_card` to true in storage', async () => {
    expect(await storage.readObject('has_seen_eligible_card')).toBe(null)

    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    render(reactQueryProviderHOC(<EighteenBirthday />))

    expect(await storage.readObject('has_seen_eligible_card')).toBe(true)
  })
})
