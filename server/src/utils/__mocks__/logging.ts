/* eslint-disable */

export const logger = {
  info(...args: any) {
    console.log('in mock info')
    console.log(...args)
  },
  warn(...args: any) {
    console.log('in mock warn')
    console.log(...args)
  },
}
