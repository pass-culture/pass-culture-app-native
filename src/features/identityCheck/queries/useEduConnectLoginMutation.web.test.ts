import { useEduConnectLoginMutation } from 'features/identityCheck/queries/useEduConnectLoginMutation'
import { act, renderHook } from 'tests/utils/web'

jest.mock('libs/eduConnectClient')
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
  it('should open new tab when calling openEduConnectTab method', async () => {
    const { result } = renderHook(() => useEduConnectLoginMutation())

    result.current.openEduConnectTab()

    await act(async () => {})

    expect(globalThis.window.open).toHaveBeenCalledTimes(1)
  })

  it('should refetch login url when calling openEduConnectTab method', async () => {
    const { result } = renderHook(() => useEduConnectLoginMutation())

    result.current.openEduConnectTab()

    await act(async () => {})

    expect(mockFetch).toHaveBeenCalledWith('https://login?redirect=false', {
      credentials: 'include',
      headers: { Authorization: 'Bearer abcd' },
      mode: 'cors',
    })
  })
})
