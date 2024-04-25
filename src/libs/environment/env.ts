import Config from '@bam.tech/react-native-config'

import { parseEnvironment } from 'libs/environment/parseEnvironment'
import { Environment } from 'libs/environment/schema'

export const env: Environment = parseEnvironment(Config)
