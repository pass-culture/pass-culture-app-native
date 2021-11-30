import React from 'react'

import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
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

  it('should render correctly if modal visible', () => {
    const renderAPI = render(
      <FastEduconnectConnectionRequestModal visible={true} hideModal={jest.fn()} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly if modal not visible', () => {
    const renderAPI = render(
      <FastEduconnectConnectionRequestModal visible={false} hideModal={jest.fn()} />
    )
    expect(renderAPI).toMatchSnapshot()
  })
})
