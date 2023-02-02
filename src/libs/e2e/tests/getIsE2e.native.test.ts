import { getIsE2e } from '../getIsE2e'

describe('getIsE2e', () => {
  it('should return true when appium server is reachable', async () => {
    process.env.NODE_ENV = 'development'
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
    } as Response)
    expect(await getIsE2e()).toBeTruthy()
    process.env.NODE_ENV = 'test'
  })
})
