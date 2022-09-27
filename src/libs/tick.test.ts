import { tick } from './tick'

describe('libs/tick', () => {
  it('awaits next tick', async () => {
    setTimeout(() => {
      expect(true).toBeTruthy()
    }, 0)
    await tick()
    expect.assertions(1)
  })
})
