import { renderHook } from '@testing-library/react-hooks'

import { getAvailableApps } from '__mocks__/react-native-launch-navigator'

import { useItinerary } from '../useItinerary'

describe('useItinerary', () => {
  it('returns availableApps', async () => {
    const { result, waitFor } = renderHook(useItinerary)
    await waitFor(() => !!result.current.availableApps)
    expect(JSON.stringify(result.current.availableApps)).toBe(
      JSON.stringify(['google_maps', 'waze'])
    )
  })
  it('returns default availableApps in case of an error', async () => {
    getAvailableApps.mockImplementationOnce(() => Promise.reject(new Error('dummyError')))
    const { result, waitFor } = renderHook(useItinerary)
    await waitFor(() => !!result.current.availableApps)
    expect(JSON.stringify(result.current.availableApps)).toBe(JSON.stringify([]))
  })
})
