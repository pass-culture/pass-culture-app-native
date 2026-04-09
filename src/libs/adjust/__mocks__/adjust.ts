import type { Adjust as AdjustType } from '../types'

export const Adjust: AdjustType = {
  initOrEnable: jest.fn(),
  isEnabled: jest.fn(),
  disable: jest.fn(),
  gdprForgetMe: jest.fn(),
  logEvent: jest.fn(),
}
