/// <reference types="node" />

import { getErrorMessage } from '../src/shared/getErrorMessage/getErrorMessage'

type Feature = { name: string; isActive: boolean }
type Features = Array<Feature>

const CYAN = '\x1b[36m'
const RED = '\x1b[31m'
const RESET_COLOR = '\x1b[0m'
const API_BASE_URL = process.argv[2] ? `https://backend.${process.argv[2]}.passculture.team` : ''

async function patchFeatures(features: Features) {
  try {
    const response = await fetch(`${API_BASE_URL}/testing/features`, {
      method: 'PATCH',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      body: JSON.stringify({
        features,
      }),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // eslint-disable-next-line no-console
    console.info(
      `${CYAN}INFO`,
      `${RESET_COLOR}${features
        .map(({ name, isActive }) => `${name} set to ${String(isActive)}`)
        .join('\n')}`
    )
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    console.error(
      `${RED}ERROR`,
      `${RESET_COLOR}Failed to patch ${features.length} feature(s): ${errorMessage}`
    )
  }
}

const enableNativeAppRecaptcha = async (isActive: boolean) => {
  return patchFeatures([
    {
      name: 'ENABLE_NATIVE_APP_RECAPTCHA',
      isActive,
    },
  ])
}

enableNativeAppRecaptcha(process.argv[3] as unknown as boolean)

export {}
