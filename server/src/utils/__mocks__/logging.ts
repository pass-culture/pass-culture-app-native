/* eslint-disable */

export const logger = {
  info(...args: any) {
    jest.fn(...args)
  },
  warn(...args: any) {
    jest.fn(...args)
  },
  error(...args: any) {
    jest.fn(...args)
  },
}
