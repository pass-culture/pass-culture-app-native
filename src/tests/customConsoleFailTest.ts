/* eslint-disable no-console */

type IgnoreConfig = {
  [K in keyof Console]?: (string | RegExp)[]
}

type ConsoleFailTestConfig = {
  console: {
    debug: boolean
    error: boolean
    log: boolean
    warn: boolean
  }
}

type ConsoleMethods = 'error' | 'warn' | 'log' | 'debug'

const extractMessage = (args: unknown[]): string => {
  return typeof args[0] === 'string' ? args[0] : ''
}

const shouldIgnoreMessage = (
  method: keyof Console,
  message: string,
  ignoreConfig: IgnoreConfig
): boolean => {
  const patterns = ignoreConfig[method] || []

  return patterns.some((pattern) =>
    typeof pattern === 'string' ? message.includes(pattern) : pattern.test(message)
  )
}

const createErrorMessage = (method: string, message: string): string => {
  return `Oh no! Your test called the following console method:\n  * ${method} (1 call)\n    > Call 0: "${message}"`
}

let _originalConsoleMethods: {
  error: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  log: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
} | null = null

const saveOriginalConsoleMethods = () => {
  if (!_originalConsoleMethods) {
    _originalConsoleMethods = {
      error: console.error,
      warn: console.warn,
      log: console.log,
      debug: console.debug,
    }
  }
  return _originalConsoleMethods
}

const createConsoleWrapper = (
  method: ConsoleMethods,
  originalMethod: (...args: unknown[]) => void,
  shouldFail: boolean,
  ignoreConfig: IgnoreConfig
) => {
  return jest.fn((...args: unknown[]) => {
    const message = extractMessage(args)

    if (shouldIgnoreMessage(method, message, ignoreConfig)) {
      return
    }

    if (shouldFail) {
      throw new Error(createErrorMessage(method, message))
    }

    originalMethod.apply(console, args)
  })
}

export function customConsoleFailTest(config: ConsoleFailTestConfig, ignoreConfig: IgnoreConfig) {
  const originalMethods = saveOriginalConsoleMethods()
  const consoleMethods: ConsoleMethods[] = ['error', 'warn', 'log', 'debug']

  consoleMethods.forEach((method) => {
    const shouldFail = !config.console[method]
    const wrapper = createConsoleWrapper(method, originalMethods[method], shouldFail, ignoreConfig)

    ;(console[method] as jest.MockedFunction<(typeof originalMethods)[typeof method]>) = wrapper
  })
}
