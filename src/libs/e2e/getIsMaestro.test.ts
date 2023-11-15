import { env } from 'libs/environment/__mocks__/envFixtures'

import { getIsMaestro } from './getIsMaestro'

const fetchSpy = jest.spyOn(global, 'fetch')
const defaultEnvironment = env.ENV

describe('getIsMaestro', () => {
  afterEach(() => {
    env.ENV = defaultEnvironment
  })

  it('should be true when maestro server is reachable', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
    } as Response)

    expect(await getIsMaestro()).toBeTruthy()
  })

  it('should be false in production environment', async () => {
    env.ENV = 'production'

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(await getIsMaestro()).toBeFalsy()
  })
})
