/**
 * This API client must be standalone as it can be used in the wdio configuration and in the tests execution environment
 * Do not add any imports
 */

type Feature = { name: string; isActive: boolean }
type Features = Array<Feature>

const fgCyan = '\x1b[36m'
const reset = '\x1b[0m'
const bright = '\x1b[1m'

class FeatureClient {
  private static API_BASE_URL = 'http://localhost:6001'
  private static ENDPOINT = 'native/v1/features'

  private async patchFeatures(features: Features) {
    const response = await fetch(`${FeatureClient.API_BASE_URL}/${FeatureClient.ENDPOINT}`, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      body: JSON.stringify({
        features,
      }),
    })
    if (response.ok) {
      console.log(
        new Date().toISOString(),
        `${fgCyan}INFO`,
        `${bright}FeatureClient`,
        `${reset}${features.map(({ name, isActive }) => `${name} set to ${isActive}`).join('\n')}`
      )
      return response
    }
    console.log(
      new Date().toISOString(),
      `${fgCyan}INFO`,
      `${bright}FeatureClient`,
      `${reset}Failed to PATCH ${FeatureClient.ENDPOINT} for ${features.length} features: ${response.statusText}`
    )
    return Promise.reject(response)
  }

  setEnableNativeAppRecaptcha = async (isActive: boolean) => {
    return this.patchFeatures([
      {
        name: 'ENABLE_NATIVE_APP_RECAPTCHA',
        isActive,
      },
    ])
  }
}

export default new FeatureClient()
