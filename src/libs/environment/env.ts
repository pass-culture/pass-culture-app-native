import Config from '@bam.tech/react-native-config'

import { parseEnvironment } from 'libs/environment/parseEnvironment'
import { Environment } from 'libs/environment/schema'

// @ts-ignore TODO(PC-36880) fix this by replacing @bam.tech/react-native-config by react-native-config
export const env: Environment = parseEnvironment(Config.getConstants())
