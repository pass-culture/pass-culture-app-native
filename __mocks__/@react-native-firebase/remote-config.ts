const remoteConfig = jest.fn().mockImplementation(() => ({
  fetch: jest.fn(() => Promise.resolve()),
  activate: jest.fn(() => Promise.resolve(true)),
  getValue: jest.fn(() => ({
    asString: () => 'mocked value',
    asBoolean: () => false,
    asNumber: () => 0,
    source: 'remote',
  })),
  setDefaults: jest.fn(() => Promise.resolve()),
}))

module.exports = remoteConfig
