import React from 'react'

import { render } from 'tests/utils'

import { SectionRow } from './SectionRow'

describe('SectionRow', () => {
  it('should use TouchableLink when is internal navigate', () => {
    const { queryByTestId } = render(
      <SectionRow type="navigable" title="navigable" navigateTo={{ screen: 'Accessibility' }} />
    )

    expect(queryByTestId('touchable-link-navigate-section-row')).toBeTruthy()
  })

  // FIXME(18668): Fix this test
  it.skip('should use Touchable when is external navigation', () => {
    const { queryByTestId } = render(
      <SectionRow type="clickable" title="clickable" externalNav={{ url: 'https://url-externe' }} />
    )

    expect(queryByTestId('touchable-external-section-row')).toBeTruthy()
  })
})
