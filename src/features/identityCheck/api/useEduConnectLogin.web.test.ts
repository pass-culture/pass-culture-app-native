import { useEduConnectLogin } from 'features/identityCheck/api/useEduConnectLogin'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/identityCheck/useIdentityCheckNavigation')
const mockFetch = jest.spyOn(global, 'fetch')

mockFetch.mockResolvedValue(
  new Response(JSON.stringify({}), {
    headers: {
      'content-type': 'application/json',
      'educonnect-redirect': 'http://finalUrl.com',
    },
    status: 200,
  })
)

describe('useEduconnectLogin', () => {
  it('should open new tab when calling openEduConnectTab method', () => {
    const { result } = renderHook(() => useEduConnectLogin())

    result.current.openEduConnectTab()

    waitFor(() => {
      expect(globalThis.window.open).toHaveBeenCalled()
    })
  })
})
