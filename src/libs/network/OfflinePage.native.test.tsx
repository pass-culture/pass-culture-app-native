import React from 'react'

import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

import { OfflinePage } from './OfflinePage'

const mockUseAuthContext = jest.fn().mockReturnValue({
  user: { ...beneficiaryUser },
  isLoggedIn: true,
})

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

describe('<OfflinePage />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should match snapshot with default message', () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false })
    render(<OfflinePage />)

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with button', () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true })
    render(<OfflinePage />)

    expect(screen).toMatchSnapshot()
  })

  it('should display new vision ui illustration when wipNewVisionUi FF activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])
    render(<OfflinePage />)

    expect(screen.getByTestId('remote-illustration')).toBeOnTheScreen()
  })
})
