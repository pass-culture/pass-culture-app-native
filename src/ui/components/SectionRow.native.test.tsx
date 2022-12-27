import React from 'react'

import { render } from 'tests/utils'

import { SectionRow } from './SectionRow'

describe('<SectionRow/>', () => {
  it('should use TouchableLink when is internal navigate', () => {
    const { queryByTestId } = render(
      <SectionRow type="navigable" title="navigable" navigateTo={{ screen: 'Accessibility' }} />
    )

    expect(queryByTestId('navigable')).toBeTruthy()
  })

  it('should use TouchableLink when is external navigation', () => {
    const { queryByTestId } = render(
      <SectionRow type="clickable" title="clickable" externalNav={{ url: 'https://url-externe' }} />
    )

    expect(queryByTestId('Nouvelle fenêtre\u00a0: clickable')).toBeTruthy()
  })

  it('should use Touchable when no navigation', () => {
    const { queryByTestId } = render(
      <SectionRow type="clickable" title="clickable" onPress={jest.fn()} />
    )

    expect(queryByTestId('clickable')).toBeTruthy()
  })
})
