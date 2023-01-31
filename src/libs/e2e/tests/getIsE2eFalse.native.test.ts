import { getIsE2e } from '../getIsE2e'

describe('getIsE2e false', () => {
  it('should return false when appium server is not reachable', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response)
    expect(await getIsE2e()).toBeFalsy()
  })
})
