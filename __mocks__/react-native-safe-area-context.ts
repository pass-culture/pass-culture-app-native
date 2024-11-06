const inset = { top: 16, right: 16, bottom: 16, left: 16 }

module.exports = {
  SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
  SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
  Consumer: jest.fn().mockImplementation(({ children }) => children(inset)),
  SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
  useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
}
