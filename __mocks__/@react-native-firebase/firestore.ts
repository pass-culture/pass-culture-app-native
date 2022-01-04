// eslint-disable-next-line @typescript-eslint/no-empty-function
const onSnapshot = jest.fn().mockReturnValue(() => {})
const get = jest.fn().mockResolvedValue({
  data: jest.fn(() => ({
    etaMessage: 'Environ 1 heure',
  })),
})
const doc = jest.fn().mockReturnValue({ onSnapshot, get })
const collection = jest.fn().mockReturnValue({ doc })

export default () => ({
  collection,
})
