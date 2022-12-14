import { Environment } from './types'

function isNumeric(string: unknown) {
  if (typeof string !== 'string') {
    return false
  }
  return !isNaN(string as unknown as number) && !isNaN(parseFloat(string))
}

export const parseNumberVariables = (
  config: Record<string, string | boolean | number>,
  ignores: string[]
): Environment => {
  const configWithActualBooleans = { ...config } as Record<
    keyof Environment,
    string | boolean | number
  >

  Object.keys(config).forEach((key) => {
    if (isNumeric(configWithActualBooleans[key as keyof Environment]) && !ignores.includes(key)) {
      configWithActualBooleans[key as keyof Environment] = Number(
        configWithActualBooleans[key as keyof Environment]
      )
    }
  })

  return configWithActualBooleans as Environment
}
