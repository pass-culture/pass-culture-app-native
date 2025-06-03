const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn((name) => {
    if (name === 'timeToInteractive') {
      return [{ name: name, entryType: 'measure', duration: 3500.5, startTime: 10 }]
    }
    if (name === 'nativeLaunchStart') {
      return [{ name: name, entryType: 'react-native-mark', startTime: 44947437, duration: 0 }]
    }
    if (name === 'screenInteractive') {
      return [{ name: name, entryType: 'mark', duration: 0, startTime: 10 }]
    }
    // Return an empty array for any other entry name requested
    return []
  }),
}

export default mockPerformance
