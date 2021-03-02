import { render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { abTesting } from './ABTesting.services'
import { ABTestingProvider } from './ABTestingProvider'

const mockedAbTestingRefresh = abTesting.refresh as jest.MockedFunction<typeof abTesting.refresh>

afterEach(jest.clearAllMocks)

describe('<ABTestingProvider />', () => {
  it('should configure() then refresh() A/B testing values then NOT call getValues() if no new config is available', async () => {
    mockedAbTestingRefresh.mockResolvedValue(false)
    renderABTestingProvider()

    await waitForExpect(() => {
      expect(abTesting.configure).toBeCalled()
      expect(abTesting.refresh).toBeCalled()
    })
    expect(abTesting.getValues).not.toBeCalled()
  })

  it('should configure() then refresh() A/B testing values then call getValues() if new config is available', async () => {
    mockedAbTestingRefresh.mockResolvedValue(true)
    renderABTestingProvider()

    await waitForExpect(() => {
      expect(abTesting.configure).toBeCalled()
      expect(abTesting.refresh).toBeCalled()
    })
    expect(abTesting.getValues).toBeCalled()
  })
})

function renderABTestingProvider() {
  return render(
    <ABTestingProvider>
      <MockChildren />
    </ABTestingProvider>
  )
}

const MockChildren = () => null
