import Config from '@bam.tech/react-native-config'

import { parseBooleanVariables } from 'libs/environment/parseBooleanVariables'

export const env = parseBooleanVariables(Config)
