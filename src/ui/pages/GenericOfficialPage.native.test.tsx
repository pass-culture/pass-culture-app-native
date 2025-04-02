import React from 'react'

import { render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

import { GenericOfficialPage } from './GenericOfficialPage'

jest.mock('libs/firebase/analytics/analytics')

describe('<GenericOfficialPage />', () => {
  it('should render correctly', () => {
    render(
      <GenericOfficialPage title="Title">
        <Typo.Body>Children...</Typo.Body>
      </GenericOfficialPage>
    )

    expect(screen).toMatchSnapshot()
  })
})
