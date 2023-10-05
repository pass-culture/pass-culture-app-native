// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'

import { AgentType } from './types'

export const AGENT_TYPE = isDesktopDeviceDetectOnWeb
  ? AgentType.browser_computer
  : AgentType.browser_mobile

export const EVENT_PAGE_VIEW_NAME = 'page_view'

export const EVENT_PAGE_VIEW_PARAM_KEY = 'page_title'
