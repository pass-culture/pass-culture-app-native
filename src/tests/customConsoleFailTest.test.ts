/* eslint-disable no-console */

import { customConsoleFailTest } from './customConsoleFailTest'

const originalConsole = {
  error: console.error,
  warn: console.warn,
  log: console.log,
  debug: console.debug,
}

afterEach(() => {
  Object.assign(console, originalConsole)
})

describe('customConsoleFailTest', () => {
  it('should allow console calls when configured as true', () => {
    customConsoleFailTest({ console: { error: true, warn: true, log: true, debug: true } }, {})

    expect(() => console.error('test')).not.toThrow()
    expect(() => console.warn('test')).not.toThrow()
    expect(() => console.log('test')).not.toThrow()
    expect(() => console.debug('test')).not.toThrow()
  })

  it('should block console calls when configured as false', () => {
    customConsoleFailTest({ console: { error: false, warn: false, log: false, debug: false } }, {})

    expect(() => console.error('test')).toThrow('console method')
    expect(() => console.warn('test')).toThrow('console method')
    expect(() => console.log('test')).toThrow('console method')
    expect(() => console.debug('test')).toThrow('console method')
  })

  it('should handle mixed configuration', () => {
    customConsoleFailTest({ console: { error: false, warn: true, log: false, debug: true } }, {})

    expect(() => console.error('test')).toThrow()
    expect(() => console.warn('test')).not.toThrow()
    expect(() => console.log('test')).toThrow()
    expect(() => console.debug('test')).not.toThrow()
  })

  it('should ignore messages based on provided patterns', () => {
    customConsoleFailTest(
      { console: { error: false, warn: false, log: false, debug: false } },
      { error: ['ReactDOM'], warn: ['Warning during test'] }
    )

    expect(() => console.error('ReactDOM.render is deprecated')).not.toThrow()
    expect(() => console.error('Other error')).toThrow()
    expect(() => console.warn('Warning during test')).not.toThrow()
    expect(() => console.warn('Other warning')).toThrow()
  })

  it('should treat non-string messages as empty', () => {
    customConsoleFailTest({ console: { error: false, warn: false, log: false, debug: false } }, {})

    expect(() => console.error({ obj: 'test' })).toThrow('Call 0: ""')
    expect(() => console.error(123)).toThrow('Call 0: ""')
  })
})
