import Config from '@bam.tech/react-native-config'

import { parseBooleanVariables } from 'libs/environment/parseBooleanVariables'

import { Environment } from './types'

export const env = parseBooleanVariables(Config) as Environment
