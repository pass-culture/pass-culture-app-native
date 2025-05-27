import { onlineManager } from '@tanstack/react-query'

import { useMinimalBuildNumber } from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import { getMinimalBuildNumber } from 'libs/firebase/firestore/getMinimalBuildNumber/getMinimalBuildNumber'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/firebase/firestore/getMinimalBuildNumber/getMinimalBuildNumber')
const mockGetMinimalBuildNumber = getMinimalBuildNumber as jest.Mock

describe('useMinimalBuildNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return minimal build number from firestore', async () => {
    mockGetMinimalBuildNumber.mockReturnValueOnce(10306000)
    const { result } = renderUseMinimalBuildNumber()

    await waitFor(() => {
      expect(result.current.minimalBuildNumber).toEqual(10306000)
    })
  })

  it('should return undefined minimal build number when connection is disabled', () => {
    onlineManager.setOnline(false)

    const { result } = renderUseMinimalBuildNumber()

    expect(result.current.minimalBuildNumber).toEqual(undefined)
  })
})

const renderUseMinimalBuildNumber = () =>
  renderHook(useMinimalBuildNumber, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
