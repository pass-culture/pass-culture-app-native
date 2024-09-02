import React from 'react'

import { IdentityCheckDMS } from 'features/identityCheck/pages/identification/dms/IdentityCheckDMS'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<IdentityCheckDMS />', () => {
  it('should render correctly', () => {
    render(<IdentityCheckDMS />)

    expect(screen).toMatchSnapshot()
  })
})
