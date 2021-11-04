import React from 'react'
import waitForExpect from 'wait-for-expect'

import { render } from 'tests/utils'

import { abTesting } from './ABTesting.services'
import { ABTestingProvider } from './ABTestingProvider'

const mockedAbTestingRefresh = abTesting.refresh as jest.MockedFunction<typeof abTesting.refresh>

describe('<ABTestingProvider />', () => {
  it('should configure() then refresh() A/B testing values then NOT call getValues() if no new config is available', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockedAbTestingRefresh.mockResolvedValue(false)
    renderABTestingProvider()

    await waitForExpect(() => {
      expect(abTesting.configure).toBeCalled()
      expect(abTesting.refresh).toBeCalled()
    })
    expect(abTesting.getValues).not.toBeCalled()
  })

  it('should configure() then refresh() A/B testing values then call getValues() if new config is available', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
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
