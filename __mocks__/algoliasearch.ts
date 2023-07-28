const getObjects = jest.fn()
const search = jest.fn()
const initIndex = jest.fn().mockReturnValue({ search, getObjects })
const multipleQueries = jest.fn()

export default jest.fn(() => ({
  initIndex,
  multipleQueries,
}))
