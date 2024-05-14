import { env } from 'libs/environment/fixtures'

import { getIsMaestroNotMemoized } from './getIsMaestroNotMemoized'

const fetchSpy = jest.spyOn(global, 'fetch')
const defaultEnvironment = env.ENV

describe('getIsMaestroNotMemoized', () => {
  afterEach(() => {
    env.ENV = defaultEnvironment
  })

  it('should be true when maestro server is reachable', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
    } as Response)

    expect(await getIsMaestroNotMemoized()).toBeTruthy()
  })

  it('should be false in production environment', async () => {
    env.ENV = 'production'

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(await getIsMaestroNotMemoized()).toBeFalsy()
  })
})
