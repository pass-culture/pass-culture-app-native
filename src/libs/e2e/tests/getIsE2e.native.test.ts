import { getIsE2e } from '../getIsE2e'

describe('getIsE2e', () => {
  it('should return true when appium server is reachable', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
    } as Response)
    expect(await getIsE2e()).toBeTruthy()
  })
})
