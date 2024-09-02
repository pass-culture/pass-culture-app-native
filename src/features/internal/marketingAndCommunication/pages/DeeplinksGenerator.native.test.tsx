import React from 'react'

import { DeeplinksGenerator } from 'features/internal/marketingAndCommunication/pages/DeeplinksGenerator'
import { render } from 'tests/utils'

jest.mock('libs/packageJson', () => ({ getAppBuildVersion: () => 1001005 }))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<DeeplinksGenerator />', () => {
  it('should render DeeplinksGenerator', () => {
    expect(render(<DeeplinksGenerator />)).toMatchSnapshot()
  })
})
