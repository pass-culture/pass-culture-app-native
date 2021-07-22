import { omit } from 'lodash'

import { parseBooleanVariables } from 'libs/environment/parseBooleanVariables'

import { Environment } from '.'

// TODO: FIXME: configure cors on backend and disable proxy in webpackDevServer.config.js#L110 when doing https://passculture.atlassian.net/browse/PC-9847
export const env = (parseBooleanVariables(
  omit(process.env, __DEV__ ? ['API_BASE_URL'] : [])
) as unknown) as Environment
