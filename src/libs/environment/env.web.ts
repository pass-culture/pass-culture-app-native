import omit from 'lodash.omit'

import { parseBooleanVariables } from 'libs/environment/parseBooleanVariables'

// TODO: FIXME: configure cors on backend and disable proxy in webpackDevServer.config.js#L110 when doing https://passculture.atlassian.net/browse/PC-9847
const config = __DEV__ ? omit(process.env, 'API_BASE_URL') : process.env

export const env = parseBooleanVariables(config as Record<string, string>)
