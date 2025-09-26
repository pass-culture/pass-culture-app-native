// Custom console-fail-test wrapper qui respecte les filtres de patchConsole

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

export function customConsoleFailTest(config: ConsoleFailTestConfig, ignoreConfig: IgnoreConfig) {
  const originalMethods = {
    // eslint-disable-next-line no-console
    error: console.error,
    // eslint-disable-next-line no-console
    warn: console.warn,
    // eslint-disable-next-line no-console
    log: console.log,
    // eslint-disable-next-line no-console
    debug: console.debug,
  }

  // Fonction pour vérifier si un message doit être ignoré
  const shouldIgnore = (method: keyof Console, message: string): boolean => {
    const patterns = ignoreConfig[method] || []

    for (const pat of patterns) {
      if (
        (typeof pat === 'string' && message.includes(pat)) ||
        (pat instanceof RegExp && pat.test(message))
      ) {
        return true
      }
    }
    return false
  }

  // Wrapper pour chaque méthode console
  const wrapConsoleMethod = (method: keyof typeof originalMethods, shouldFail: boolean) => {
    const original = originalMethods[method]

    // eslint-disable-next-line no-console
    ;(console[method] as jest.MockedFunction<(typeof originalMethods)[typeof method]>) = jest.fn(
      (...args: unknown[]) => {
        const message = typeof args[0] === 'string' ? args[0] : ''

        if (shouldIgnore(method, message)) {
          return
        }

        if (shouldFail) {
          throw new Error(
            `Oh no! Your test called the following console method:\n  * ${method} (1 call)\n    > Call 0: "${message}"`
          )
        }

        original.apply(console, args)
      }
    )
  }

  // Appliquer les wrappers selon la config
  wrapConsoleMethod('error', !config.console.error)
  wrapConsoleMethod('warn', !config.console.warn)
  wrapConsoleMethod('log', !config.console.log)
  wrapConsoleMethod('debug', !config.console.debug)
}
