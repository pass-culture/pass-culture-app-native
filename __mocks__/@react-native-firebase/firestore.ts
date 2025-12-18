const mockSnapshot = {
  data: jest.fn(() => ({
    etaMessage: 'Environ 1 heure',
  })),
  exists: true,
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const onSnapshot = jest.fn().mockReturnValue(() => {})

export const getDoc = jest.fn().mockResolvedValue(mockSnapshot)

export const doc = jest.fn().mockReturnValue({ id: 'mock-doc-id', path: 'mock/path' })
export const collection = jest.fn().mockReturnValue({ id: 'mock-col-id', path: 'mock/path' })

export const getFirestore = jest.fn(() => ({}))
export const disableNetwork = jest.fn()
export const enableNetwork = jest.fn()

export default getFirestore
