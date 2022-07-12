const getObjects = jest.fn()
const search = jest.fn()
const initIndex = jest.fn().mockReturnValue({ search, getObjects })

export default jest.fn(() => ({
  initIndex,
  search,
}))
