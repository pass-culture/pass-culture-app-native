const mockTrace = {
  putMetric: jest.fn(),
  // Mock for trace.stop() - needs to return a resolved Promise because it's awaited
  stop: jest.fn().mockResolvedValue(undefined),
}
const mockPerfInstance = {
  // Mock for perf().startTrace() - needs to return a resolved Promise containing the mockTrace object because it's awaited
  startTrace: jest.fn().mockResolvedValue(mockTrace),
}
// Return the mock function for the default export `perf()`
const mockPerf = jest.fn(() => mockPerfInstance)

export default mockPerf
