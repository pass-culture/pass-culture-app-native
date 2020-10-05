export function tick(): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, 0)
  )
}

describe('Utils', () => {
  describe('tick', () => {
    it('awaits next tick', async () => {
      setTimeout(() => {
        expect(true).toBeTruthy()
      }, 0)
      await tick()
      expect.assertions(1)
    })
  })
})
