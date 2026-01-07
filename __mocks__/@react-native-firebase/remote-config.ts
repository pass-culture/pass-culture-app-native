const mockInstance = {
  fetch: jest.fn(() => Promise.resolve()),
  activate: jest.fn(() => Promise.resolve(true)),
  fetchAndActivate: jest.fn(() => Promise.resolve(true)),
  setDefaults: jest.fn(() => Promise.resolve()),
  getAll: jest.fn(() => ({})),

  getValue: jest.fn(() => ({
    asString: () => 'mocked value',
    asBoolean: () => false,
    asNumber: () => 0,
    source: 'remote',
  })),
}

const remoteConfig = jest.fn(() => mockInstance)

export const getRemoteConfig = jest.fn(() => mockInstance)

export default remoteConfig
