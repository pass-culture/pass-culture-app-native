import Config from '@bam.tech/react-native-config'

import { parseBooleanVariables } from 'libs/environment/parseBooleanVariables'

import { Environment } from './types'

export const env = parseBooleanVariables(Config) as Environment

export const EMAIL_PROVIDER_CUSTOM_URL = `https://${env.EMAIL_PROVIDER_CUSTOM_DOMAIN}`
