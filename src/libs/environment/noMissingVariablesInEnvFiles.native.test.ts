import { config } from 'dotenv'

import { parseEnvironment } from 'libs/environment/parseEnvironment'

function loadEnvVariables(filePath: string) {
  const { parsed, error } = config({ path: filePath })
  if (error) {
    throw error
  }
  if (!parsed) {
    throw new Error(`No variables found in ${filePath}`)
  }

  return Object.keys(parsed)
}

function compareEnvFiles(envFiles: string[]) {
  const envData: Record<string, string[]> = {}
  envFiles.forEach((file) => {
    envData[file] = loadEnvVariables(file)
  })

  const allKeys = new Set<string>()
  for (const data of Object.values(envData)) {
    for (const key of data) {
      allKeys.add(key)
    }
  }

  const missing: Record<string, string[]> = {}
  for (const [file, data] of Object.entries(envData)) {
    missing[file] = Array.from(allKeys).filter((x) => !data.includes(x))
  }

  return missing
}

describe('.env files', () => {
  const envFiles = ['.env.testing', '.env.staging', '.env.integration', '.env.production']

  test('all variables should be present in all .env files', () => {
    const checkEnv = () => {
      const missingVariables = compareEnvFiles(envFiles)
      for (const [file, variables] of Object.entries(missingVariables)) {
        if (variables.length > 0) {
          throw new Error(`Missing variables in ${file}: ${variables.join(', ')}`)
        }
      }
    }

    expect(checkEnv).not.toThrow()
  })

  test('.env file should match yup schema', () => {
    const checkEnv = () => {
      for (const file of envFiles) {
        const { parsed: env } = config({ path: file })
        if (!env) {
          throw new Error(`No variables found in ${file}`)
        }

        parseEnvironment(env)
      }
    }

    expect(checkEnv).not.toThrow()
  })
})
