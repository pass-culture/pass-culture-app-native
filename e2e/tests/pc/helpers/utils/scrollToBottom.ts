import { flags } from './platform'
import { timeout } from './time'

export const scrollToBottom = async (finalHeightPercentage: number = 0.9) => {
  if (flags.isWeb) return

  await timeout(300)

  const { width, height } = await driver.getWindowSize()
  const anchor = 0.5 * width
  const startPoint = finalHeightPercentage * height
  const endPoint = (1 - finalHeightPercentage) * height

  await driver.touchPerform([
    {
      action: 'press',
      options: {
        x: anchor,
        y: startPoint,
      },
    },
    {
      action: 'wait',
      options: {
        ms: 100,
      },
    },
    {
      action: 'moveTo',
      options: {
        x: anchor,
        y: endPoint,
      },
    },
    {
      action: 'release',
      options: {},
    },
  ])
}
