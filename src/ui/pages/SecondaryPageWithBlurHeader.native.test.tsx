import React from 'react'

import { render, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

import { SecondaryPageWithBlurHeader } from './SecondaryPageWithBlurHeader'

describe('<SecondaryPageWithBlurHeader />', () => {
  it('should render correctly', () => {
    render(
      <SecondaryPageWithBlurHeader headerTitle="GenericInfoPageWhite">
        <Typo.Title3>Children</Typo.Title3>
      </SecondaryPageWithBlurHeader>
    )

    expect(screen).toMatchSnapshot()
  })
})
