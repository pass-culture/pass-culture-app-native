import Config from '@bam.tech/react-native-config'

import { parseBooleanVariables } from 'libs/environment/parseBooleanVariables'
import { Environment } from 'libs/environment/schema'

export const env: Environment = parseBooleanVariables(Config)
