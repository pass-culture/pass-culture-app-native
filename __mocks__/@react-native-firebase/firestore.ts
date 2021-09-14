// eslint-disable-next-line @typescript-eslint/no-empty-function
const onSnapshot = jest.fn().mockReturnValue(() => {})
const get = jest.fn().mockResolvedValue({
  data: jest.fn(() => ({
    load_percent: 34,
  })),
})
const doc = jest.fn().mockReturnValue({ onSnapshot, get })
const collection = jest.fn().mockReturnValue({ doc })

export default () => ({
  collection,
})
