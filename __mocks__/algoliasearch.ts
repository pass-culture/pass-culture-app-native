const search = jest.fn()
const initIndex = jest.fn().mockReturnValue({ search })

export default jest.fn(() => ({
  initIndex,
}))
