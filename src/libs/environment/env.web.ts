import { omit } from 'lodash'

import { parseBooleanVariables } from 'libs/environment/parseBooleanVariables'

import { Environment } from '.'

// TODO: FIXME: configure cors on backend and disable proxy in webpackDevServer.config.js#L110
export const env = (parseBooleanVariables(
  omit(process.env, ['API_BASE_URL'])
) as unknown) as Environment
