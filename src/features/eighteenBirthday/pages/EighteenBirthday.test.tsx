import { render } from '@testing-library/react-native'
import React from 'react'

import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { EighteenBirthday } from './EighteenBirthday'

afterEach(() => {
  storage.clear('has_seen_eligible_card')
})

describe('<EighteenBirthday />', () => {
  it('should render eighteen birthday', () => {
    const renderAPI = render(reactQueryProviderHOC(<EighteenBirthday />))
    expect(renderAPI).toMatchSnapshot()
  })

  it('should set `has_seen_eligible_card` to true in storage', async () => {
    expect(await storage.readObject('has_seen_eligible_card')).toBe(null)

    render(reactQueryProviderHOC(<EighteenBirthday />))

    expect(await storage.readObject('has_seen_eligible_card')).toBe(true)
  })
})
