import { AgentType } from 'api/gen'
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'

export const AGENT_TYPE = isDesktopDeviceDetectOnWeb
  ? AgentType.browser_computer
  : AgentType.browser_mobile
