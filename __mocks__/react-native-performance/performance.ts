const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn((name) => {
    if (name === 'timeToInteractive') {
      return [{ name: name, duration: 3500.5, startTime: 10, entryType: 'measure' }]
    }
    // Return an empty array for any other entry name requested
    return []
  }),
}

export default mockPerformance
