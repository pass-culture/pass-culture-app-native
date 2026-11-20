import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input:
    process.env.NATIVE_API_OPENAPI_URL ??
    'https://backend.testing.passculture.team/native/openapi.json',
  output: {
    path: 'src/api/hey-api-gen',
    clean: true,
  },
  plugins: [
    {
      name: '@hey-api/typescript',
      enums: 'typescript',
      case: 'preserve',
    },
    {
      name: '@hey-api/sdk',
      responseStyle: 'data',
    },
    {
      name: '@hey-api/client-fetch',
      throwOnError: true,
    },
  ],
})
