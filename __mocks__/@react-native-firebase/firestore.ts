// eslint-disable-next-line @typescript-eslint/no-empty-function
const onSnapshot = jest.fn().mockReturnValue(() => {})
const doc = jest.fn().mockReturnValue({ onSnapshot })
const collection = jest.fn().mockReturnValue({ doc })

export default () => ({
  collection,
})
