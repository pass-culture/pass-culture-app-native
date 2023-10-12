import React from 'react'

import { render, screen } from 'tests/utils'

import { SectionRow } from './SectionRow'

describe('<SectionRow/>', () => {
  it('should use TouchableLink when is internal navigate', () => {
    render(
      <SectionRow type="navigable" title="navigable" navigateTo={{ screen: 'Accessibility' }} />
    )

    expect(screen.queryByTestId('navigable')).toBeOnTheScreen()
  })

  it('should use TouchableLink when is external navigation', () => {
    render(
      <SectionRow type="clickable" title="clickable" externalNav={{ url: 'https://url-externe' }} />
    )

    expect(screen.queryByTestId('Nouvelle fenêtre\u00a0: clickable')).toBeOnTheScreen()
  })

  it('should use Touchable when no navigation', () => {
    render(<SectionRow type="clickable" title="clickable" onPress={jest.fn()} />)

    expect(screen.queryByTestId('clickable')).toBeOnTheScreen()
  })
})
