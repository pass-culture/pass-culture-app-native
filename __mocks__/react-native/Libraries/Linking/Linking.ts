// Links cannot be opened in node.js environment
export const addEventListener = jest.fn()
export const canOpenURL = jest.fn().mockResolvedValue(true)
export const getInitialURL = jest.fn()
export const openSettings = jest.fn()
export const openURL = jest.fn()
export const removeEventListener = jest.fn()
