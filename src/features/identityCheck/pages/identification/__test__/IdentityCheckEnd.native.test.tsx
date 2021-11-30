import React from 'react'

import { IdentityCheckEnd } from 'features/identityCheck/pages/identification/IdentityCheckEnd'
import { render } from 'tests/utils'

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

describe('<IdentityCheckEnd/>', () => {
  beforeAll(() => jest.useFakeTimers())
  afterAll(() => jest.useRealTimers())

  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckEnd />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen after timeout', () => {
    render(<IdentityCheckEnd />)
    expect(mockNavigateToNextScreen).not.toHaveBeenCalled()
    jest.advanceTimersByTime(3000)
    expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
  })
})
