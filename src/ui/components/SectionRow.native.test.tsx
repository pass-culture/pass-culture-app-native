import React from 'react'

import { render, screen } from 'tests/utils'

import { SectionRow } from './SectionRow'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('<SectionRow/>', () => {
  it('should use TouchableLink when is internal navigate', () => {
    render(
      <SectionRow type="navigable" title="navigable" navigateTo={{ screen: 'Accessibility' }} />
    )

    expect(screen.getByTestId('navigable')).toBeOnTheScreen()
  })

  it('should use TouchableLink when is external navigation', () => {
    render(
      <SectionRow type="clickable" title="clickable" externalNav={{ url: 'https://url-externe' }} />
    )

    expect(screen.getByTestId('Nouvelle fenêtre\u00a0: clickable')).toBeOnTheScreen()
  })

  it('should use Touchable when no navigation', () => {
    render(<SectionRow type="clickable" title="clickable" onPress={jest.fn()} />)

    expect(screen.getByTestId('clickable')).toBeOnTheScreen()
  })
})
