export const amplitude = jest.fn(() => ({
  logEvent: jest.fn().mockReturnValue(undefined),
  disableCollection: jest.fn(),
  enableCollection: jest.fn(),
}))
