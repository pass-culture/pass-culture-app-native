import Config from '@bam.tech/react-native-config'

import { parseBooleanVariables } from 'libs/environment/parseBooleanVariables'

import { Environment } from '.'

export const env = parseBooleanVariables(Config) as Environment
